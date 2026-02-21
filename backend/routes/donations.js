const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdDate: -1 });
    res.json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pending donations
router.get('/pending', async (req, res) => {
  try {
    const pendingDonations = await Donation.find({ 
      status: { $in: ['Pending', 'Accepted by Volunteer'] } 
    }).sort({ createdDate: -1 });
    res.json({ success: true, data: pendingDonations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new donation
router.post('/', async (req, res) => {
  try {
    console.log('📝 Received donation request:', JSON.stringify(req.body, null, 2));
    
    const donationData = {
      ...req.body,
      donorId: req.body.donorId || 'D-' + Date.now(),
      item: req.body.itemType || req.body.item,
      tracking: {
        currentLocation: req.body.pickupLocation,
        coordinates: req.body.coordinates || null,
        lastUpdate: new Date(),
        locationHistory: [{
          location: req.body.pickupLocation,
          timestamp: new Date(),
          status: 'Donation Created',
          coordinates: req.body.coordinates || null,
          note: 'Donation request submitted successfully'
        }],
        distanceCovered: '0 km',
        statusProgress: {
          created: true,
          accepted: false,
          pickedUp: false,
          inTransit: false,
          delivered: false
        }
      }
    };
    
    console.log('💾 Creating donation in database...');
    const donation = await Donation.create(donationData);
    console.log('✅ Donation created successfully:', donation.donationId);
    
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    console.error('❌ Error creating donation:', error.message);
    console.error('Stack:', error.stack);
    res.status(400).json({ 
      success: false, 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update donation status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, volunteerData } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = status;
    if (volunteerData) {
      donation.assignedVolunteer = volunteerData.name;
      donation.volunteerId = volunteerData.volunteerId;
      donation.volunteerResponse = volunteerData.response;
    }

    // Update tracking
    if (donation.tracking) {
      donation.tracking.lastUpdate = new Date();
      donation.tracking.locationHistory.push({
        location: donation.tracking.currentLocation,
        timestamp: new Date(),
        status: status,
        coordinates: donation.tracking.coordinates,
        note: volunteerData ? `${volunteerData.name} ${volunteerData.response} the donation` : `Status changed to ${status}`
      });

      // Update progress
      if (status === 'Accepted by Volunteer') {
        donation.tracking.statusProgress.accepted = true;
      } else if (status === 'Picked Up') {
        donation.tracking.statusProgress.pickedUp = true;
      } else if (status === 'In Transit') {
        donation.tracking.statusProgress.inTransit = true;
      } else if (status === 'Delivered') {
        donation.tracking.statusProgress.delivered = true;
      }
    }

    await donation.save();
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Accept donation (volunteer action)
router.post('/:id/accept', async (req, res) => {
  try {
    const { volunteerData } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'Accepted by Volunteer';
    donation.assignedVolunteer = volunteerData.name;
    donation.volunteerId = volunteerData.volunteerId;
    donation.volunteerResponse = 'accepted';

    if (donation.tracking) {
      donation.tracking.lastUpdate = new Date();
      donation.tracking.statusProgress.accepted = true;
      donation.tracking.locationHistory.push({
        location: donation.tracking.currentLocation,
        timestamp: new Date(),
        status: 'Accepted by Volunteer',
        coordinates: donation.tracking.coordinates,
        note: `${volunteerData.name} accepted the donation`
      });
    }

    await donation.save();
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Decline donation (volunteer action)
router.post('/:id/decline', async (req, res) => {
  try {
    const { volunteerData } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'Declined';
    donation.volunteerResponse = 'declined';

    if (donation.tracking) {
      donation.tracking.lastUpdate = new Date();
      donation.tracking.locationHistory.push({
        location: donation.tracking.currentLocation,
        timestamp: new Date(),
        status: 'Declined',
        coordinates: donation.tracking.coordinates,
        note: `${volunteerData.name} declined the donation`
      });
    }

    await donation.save();
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update donation location
router.patch('/:id/location', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.tracking) {
      donation.tracking.currentLocation = req.body.address;
      donation.tracking.coordinates = req.body.coordinates;
      donation.tracking.lastUpdate = new Date();
      donation.tracking.distanceCovered = req.body.distanceCovered || donation.tracking.distanceCovered;
      donation.tracking.estimatedDelivery = req.body.estimatedDelivery || donation.tracking.estimatedDelivery;

      donation.tracking.locationHistory.push({
        location: req.body.address,
        timestamp: new Date(),
        status: req.body.status || 'Moving',
        coordinates: req.body.coordinates,
        note: req.body.note || ''
      });
    }

    await donation.save();
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Pickup donation
router.post('/:id/pickup', async (req, res) => {
  try {
    const { volunteerData, pickupData } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'Picked Up';
    donation.assignedVolunteer = volunteerData.name;
    donation.volunteerId = volunteerData.volunteerId;
    donation.volunteerPhone = volunteerData.phone;
    donation.volunteerVehicle = volunteerData.vehicle;
    donation.volunteerResponse = 'accepted';

    if (donation.tracking) {
      donation.tracking.currentLocation = pickupData.currentLocation;
      donation.tracking.coordinates = pickupData.coordinates;
      donation.tracking.lastUpdate = new Date();
      donation.tracking.destinationAddress = pickupData.destinationAddress;
      donation.tracking.estimatedDelivery = pickupData.estimatedDelivery;
      donation.tracking.statusProgress.pickedUp = true;
      
      donation.tracking.locationHistory.push({
        location: pickupData.currentLocation,
        timestamp: new Date(),
        status: 'Picked Up by Volunteer',
        coordinates: pickupData.coordinates,
        note: `Picked up by ${volunteerData.name}`
      });
    }

    await donation.save();
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Mark as in transit
router.post('/:id/transit', async (req, res) => {
  try {
    const { locationData } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'In Transit';
    
    if (donation.tracking) {
      donation.tracking.statusProgress.inTransit = true;
      donation.tracking.currentLocation = locationData.address;
      donation.tracking.coordinates = locationData.coordinates;
      donation.tracking.lastUpdate = new Date();
      donation.tracking.distanceCovered = locationData.distanceCovered || donation.tracking.distanceCovered;
      
      donation.tracking.locationHistory.push({
        location: locationData.address,
        timestamp: new Date(),
        status: 'In Transit',
        coordinates: locationData.coordinates,
        note: locationData.note || ''
      });
    }

    await donation.save();
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Mark as delivered
router.post('/:id/deliver', async (req, res) => {
  try {
    const { deliveryData = {} } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'Delivered';
    
    if (donation.tracking) {
      donation.tracking.statusProgress.delivered = true;
      donation.tracking.lastUpdate = new Date();
      
      donation.tracking.locationHistory.push({
        location: deliveryData.location || donation.tracking.destinationAddress || 'Destination',
        timestamp: new Date(),
        status: 'Delivered',
        coordinates: deliveryData.coordinates || donation.tracking.coordinates,
        note: deliveryData.note || 'Donation successfully delivered'
      });
    }

    await donation.save();
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Clear all donations (for testing)
router.delete('/all', async (req, res) => {
  try {
    await Donation.deleteMany({});
    res.json({ success: true, message: 'All donations cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
