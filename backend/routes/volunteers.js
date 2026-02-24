const express = require('express');
const router = express.Router();
const NeedyPerson = require('../models/NeedyPerson');
const VerifiedDonation = require('../models/VerifiedDonation');

// Initialize default needy people data if empty
(async () => {
  const count = await NeedyPerson.countDocuments();
  if (count === 0) {
    const defaultPeople = [
      { needyId: 'N001', name: 'Ramesh Patil', area: 'Nagpur', category: 'Food' },
      { needyId: 'N002', name: 'Sunita Kale', area: 'Pune', category: 'Clothes' },
      { needyId: 'N003', name: 'Mohan Deshmukh', area: 'Mumbai', category: 'Education' },
      { needyId: 'N004', name: 'Asha Jadhav', area: 'Nashik', category: 'Medical' },
      { needyId: 'N005', name: 'Ravi More', area: 'Aurangabad', category: 'Daily Essentials' },
      { needyId: 'N006', name: 'Pooja Shinde', area: 'Kolhapur', category: 'Food' },
      { needyId: 'N007', name: 'Suresh Pawar', area: 'Solapur', category: 'Clothes' },
      { needyId: 'N008', name: 'Kavita Thakur', area: 'Thane', category: 'Education' },
      { needyId: 'N009', name: 'Anil Pawar', area: 'Amravati', category: 'Medical' },
      { needyId: 'N010', name: 'Neha Kulkarni', area: 'Satara', category: 'Daily Essentials' }
    ];
    await NeedyPerson.insertMany(defaultPeople);
    console.log('✅ Initialized 10 needy people records');
  }
})();

// OTP Storage (in-memory, replace with Redis in production)
const otpStore = new Map();

// Twilio Configuration
const twilio = require('twilio');
const client = process.env.ENABLE_SMS === 'true' && process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to send SMS
const sendSMS = async (phoneNumber, message) => {
  if (process.env.ENABLE_SMS === 'true' && client) {
    try {
      // Add country code if not present (assuming Indian numbers +91)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });

      console.log(`✅ SMS sent successfully to ${formattedPhone}. SID: ${result.sid}`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending SMS to ${phoneNumber}:`, error.message);
      return false;
    }
  }
  return false; // SMS not enabled
};

// Get all needy people
router.get('/', async (req, res) => {
  try {
    const needyPeople = await NeedyPerson.find();
    res.json({ success: true, data: needyPeople });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get needy person by ID
router.get('/:id', async (req, res) => {
  try {
    const person = await NeedyPerson.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found' });
    }
    res.json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send OTP to phone
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber, needyPersonId } = req.body;

    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with 5-minute expiry
    const key = `${phoneNumber}-${needyPersonId}`;
    otpStore.set(key, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // Send SMS if enabled
    const smsMessage = `Your Care Connect OTP is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;
    const smsSent = await sendSMS(phoneNumber, smsMessage);

    // Log OTP to console for development
    console.log(`📱 OTP for ${phoneNumber}: ${otp} (SMS: ${smsSent ? 'Sent' : 'Demo mode'})`);

    res.json({
      success: true,
      message: smsSent ? 'OTP sent to your mobile number' : 'OTP generated (Demo mode)',
      smsSent: smsSent,
      // Return OTP for demo purposes only (remove in production)
      demoOTP: process.env.ENABLE_SMS !== 'true' ? otp : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, needyPersonId, otp } = req.body;

    const key = `${phoneNumber}-${needyPersonId}`;
    const storedData = otpStore.get(key);

    if (!storedData) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP verified successfully
    otpStore.delete(key);

    // Get needy person details
    const needyPerson = await NeedyPerson.findOne({ needyId: needyPersonId });

    // Create verified donation record
    const verifiedDonation = await VerifiedDonation.create({
      needyPersonId: needyPersonId,
      needyPersonName: needyPerson.name,
      needyPersonArea: needyPerson.area,
      needyPersonCategory: needyPerson.category,
      phoneNumber: phoneNumber,
      verifiedAt: new Date()
    });

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: verifiedDonation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all verified donations
router.get('/verified/all', async (req, res) => {
  try {
    const verifiedDonations = await VerifiedDonation.find();
    res.json({ success: true, data: verifiedDonations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
