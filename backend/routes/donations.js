const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// Get all donations
router.get('/', (req, res) => {
  try {
    const donations = Donation.getAll();
    res.json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pending donations
router.get('/pending', (req, res) => {
  try {
    const pendingDonations = Donation.getPending();
    res.json({ success: true, data: pendingDonations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get donation by ID
router.get('/:id', (req, res) => {
  try {
    const donation = Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new donation
router.post('/', (req, res) => {
  try {
    const donation = Donation.create(req.body);
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update donation status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, volunteerData } = req.body;
    const donation = Donation.updateStatus(parseInt(req.params.id), status, volunteerData);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Accept donation (volunteer action)
router.post('/:id/accept', (req, res) => {
  try {
    const { volunteerData } = req.body;
    const donation = Donation.updateStatus(
      parseInt(req.params.id), 
      'Accepted by Volunteer', 
      {
        name: volunteerData.name,
        volunteerId: volunteerData.volunteerId,
        response: 'accepted'
      }
    );
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Decline donation (volunteer action)
router.post('/:id/decline', (req, res) => {
  try {
    const { volunteerData } = req.body;
    const donation = Donation.updateStatus(
      parseInt(req.params.id), 
      'Declined by Volunteer', 
      {
        name: volunteerData.name,
        volunteerId: volunteerData.volunteerId,
        response: 'declined'
      }
    );
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update donation location
router.patch('/:id/location', (req, res) => {
  try {
    const donation = Donation.updateLocation(parseInt(req.params.id), req.body);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Pickup donation
router.post('/:id/pickup', (req, res) => {
  try {
    const { volunteerData, pickupData } = req.body;
    const donation = Donation.findById(parseInt(req.params.id));
    
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
      donation.tracking.lastUpdate = new Date().toISOString();
      donation.tracking.destinationAddress = pickupData.destinationAddress;
      donation.tracking.estimatedDelivery = pickupData.estimatedDelivery;
      donation.tracking.statusProgress.pickedUp = true;
      
      donation.tracking.locationHistory.push({
        location: pickupData.currentLocation,
        timestamp: new Date().toISOString(),
        status: 'Picked Up by Volunteer',
        coordinates: pickupData.coordinates,
        note: `Picked up by ${volunteerData.name}`
      });
    }

    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Mark as in transit
router.post('/:id/transit', (req, res) => {
  try {
    const { locationData } = req.body;
    const donation = Donation.findById(parseInt(req.params.id));
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'In Transit';
    if (donation.tracking) {
      donation.tracking.statusProgress.inTransit = true;
    }

    Donation.updateLocation(parseInt(req.params.id), {
      ...locationData,
      status: 'In Transit'
    });

    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Mark as delivered
router.post('/:id/deliver', (req, res) => {
  try {
    const { deliveryData = {} } = req.body;
    const donation = Donation.findById(parseInt(req.params.id));
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'Delivered';
    
    if (donation.tracking) {
      donation.tracking.statusProgress.delivered = true;
      donation.tracking.lastUpdate = new Date().toISOString();
      
      donation.tracking.locationHistory.push({
        location: deliveryData.location || donation.tracking.destinationAddress || 'Destination',
        timestamp: new Date().toISOString(),
        status: 'Delivered',
        coordinates: deliveryData.coordinates || donation.tracking.coordinates,
        note: deliveryData.note || 'Donation successfully delivered'
      });
    }

    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Clear all donations (for testing)
router.delete('/all', (req, res) => {
  try {
    Donation.deleteAll();
    res.json({ success: true, message: 'All donations cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
