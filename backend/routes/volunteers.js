const express = require('express');
const router = express.Router();
const NeedyPerson = require('../models/NeedyPerson');
const VerifiedDonation = require('../models/VerifiedDonation');

// OTP Storage (in-memory, replace with Redis in production)
const otpStore = new Map();

// Get all needy people
router.get('/', (req, res) => {
  try {
    const needyPeople = NeedyPerson.getAll();
    res.json({ success: true, data: needyPeople });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get needy person by ID
router.get('/:id', (req, res) => {
  try {
    const person = NeedyPerson.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found' });
    }
    res.json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send OTP to phone
router.post('/send-otp', (req, res) => {
  try {
    const { phoneNumber, needyPersonId } = req.body;
    
    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    // Generate OTP
    const otp = NeedyPerson.generateOTP();
    
    // Store OTP with 5-minute expiry
    const key = `${phoneNumber}-${needyPersonId}`;
    otpStore.set(key, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // In production, send SMS via Twilio/AWS SNS
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // Return OTP for demo purposes only
      demoOTP: otp 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
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
    const needyPerson = NeedyPerson.findById(needyPersonId);
    
    // Create verified donation record
    const verifiedDonation = VerifiedDonation.create({
      needyPersonId: needyPersonId,
      needyPersonName: needyPerson.name,
      needyPersonArea: needyPerson.area,
      needyPersonCategory: needyPerson.category,
      phoneNumber: phoneNumber,
      verifiedAt: new Date().toISOString()
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
router.get('/verified/all', (req, res) => {
  try {
    const verifiedDonations = VerifiedDonation.getAll();
    res.json({ success: true, data: verifiedDonations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
