const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const OrganizationNeed = require('../models/OrganizationNeed');
const User = require('../models/User');
const Donation = require('../models/Donation');
const VerifiedDonation = require('../models/VerifiedDonation');
const NeedyPerson = require('../models/NeedyPerson');

const organizationProfile = {
  name: 'Hope City Community Center',
  registrationId: 'ORG-2025-0042',
  areasServed: ['North District', 'South District', 'Central Zone'],
  contact: {
    email: 'info@hopecity.org',
    phone: '+1-555-0123',
    address: '789 Community Lane, Hope City'
  },
  verificationStatus: 'Admin Verified',
  verifiedDate: '2025-11-15',
  donationCategoriesAccepted: ['Food', 'Clothes', 'Education', 'Medical', 'Essentials'],
  totalDonationsReceived: 287,
  trustScore: 4.9
};

// Get organization profile
router.get('/profile', (req, res) => {
  try {
    res.json({ success: true, data: organizationProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get comprehensive dashboard data
router.get('/dashboard-data', async (req, res) => {
  try {
    // 1. Get Volunteers from User collection
    const volunteers = await User.find({ role: 'volunteer' }).select('name userId phone email createdAt');
    const formattedVolunteers = volunteers.map((v, idx) => ({
      id: v._id,
      name: v.name,
      volunteerId: v.userId || `VOL-${String(idx + 1).padStart(3, '0')}`,
      status: 'Available', // Mock status for now, could be derived from active tasks
      currentTasks: 0,
      contact: v.phone || v.email,
      area: 'Various locations',
      tasksInProgress: []
    }));

    // 2. Get Inventory Log (Received vs Distributed)
    // "Received" are donations marked as Delivered
    const deliveredDonations = await Donation.find({ status: 'Delivered' }).sort({ updatedAt: -1 });
    // "Distributed" are verified donations delivered to needy people
    const verifiedDonations = await VerifiedDonation.find().sort({ verifiedAt: -1 });

    const inventoryLog = [
      ...deliveredDonations.map(d => ({
        id: `rec-${d._id}`,
        date: new Date(d.updatedAt || d.createdAt).toISOString().split('T')[0],
        type: 'Received',
        category: d.category,
        item: d.item,
        quantity: d.quantity,
        donor: d.donorName || 'Anonymous',
        status: 'Stored'
      })),
      ...verifiedDonations.map(v => ({
        id: `dist-${v._id}`,
        date: new Date(v.verifiedAt).toISOString().split('T')[0],
        type: 'Distributed',
        category: v.category,
        item: v.item,
        quantity: v.quantity,
        beneficiary: v.needyPersonName,
        beneficiaryType: 'Needy Person',
        status: 'Completed'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // 3. Dynamic Profile Stats
    const totalDonationsReceived = deliveredDonations.length;
    const dynamicProfile = {
      ...organizationProfile,
      totalDonationsReceived
    };

    res.json({
      success: true,
      data: {
        profile: dynamicProfile,
        volunteers: formattedVolunteers,
        inventory: inventoryLog
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Seed data if empty
const seedNeedsIfEmpty = async () => {
  try {
    const count = await OrganizationNeed.countDocuments();
    if (count === 0) {
      await OrganizationNeed.insertMany([
        {
          reqId: 'REQ-001',
          organizationId: 'ORG-2025-0042',
          organizationName: 'Hope City Community Center',
          category: 'Food',
          itemDescription: 'Rice, Dal, Cooking Oil',
          quantityNeeded: '100 kg',
          urgencyLevel: 'High',
          location: 'Children Shelter - North District',
          beneficiaryType: 'Children (25 kids)',
          estimatedDuration: 'Monthly',
          status: 'Active'
        },
        {
          reqId: 'REQ-002',
          organizationId: 'ORG-2025-0042',
          organizationName: 'Hope City Community Center',
          category: 'Education',
          itemDescription: 'Notebooks, Pencils, Books',
          quantityNeeded: '200 pieces',
          urgencyLevel: 'Medium',
          location: 'Community School - South District',
          beneficiaryType: 'Students (40 students)',
          estimatedDuration: 'Quarterly',
          status: 'Active'
        }
      ]);
    }
  } catch (err) {
    console.error('Error seeding needs:', err);
  }
};
seedNeedsIfEmpty();

// Register a new needy person
router.post('/needy-people', async (req, res) => {
  try {
    const { name, area, category, phone } = req.body;

    if (!name || !area || !category) {
      return res.status(400).json({ success: false, message: 'Name, area, and category are required' });
    }

    // Generate a unique ID
    const count = await NeedyPerson.countDocuments();
    const needyId = `N${String(count + 1).padStart(3, '0')}-${Date.now().toString().slice(-4)}`;

    const newPerson = new NeedyPerson({
      needyId,
      name,
      area,
      category,
      phone: phone || ''
    });

    await newPerson.save();

    res.status(201).json({
      success: true,
      data: newPerson
    });

  } catch (error) {
    console.error('Error adding needy person:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get organization needs/requests
router.get('/needs', async (req, res) => {
  try {
    const needs = await OrganizationNeed.find().sort({ createdAt: -1 });

    // Map data to match what the frontend expects
    const formattedNeeds = needs.map(n => ({
      _id: n._id.toString(),
      id: n._id.toString(),
      requestId: n.reqId,
      category: n.category,
      itemDescription: n.itemDescription,
      quantityNeeded: n.quantityNeeded,
      urgencyLevel: n.urgencyLevel,
      location: n.location,
      postedDate: n.createdAt.toISOString().split('T')[0],
      status: n.status,
      beneficiaryType: n.beneficiaryType,
      estimatedDuration: n.estimatedDuration
    }));

    res.json({ success: true, data: formattedNeeds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new need/request
router.post('/needs', async (req, res) => {
  try {
    const newNeedData = {
      ...req.body,
      organizationId: organizationProfile.registrationId,
      organizationName: organizationProfile.name,
      status: 'Active'
    };

    const need = new OrganizationNeed(newNeedData);
    await need.save();

    const formattedNeed = {
      _id: need._id.toString(),
      id: need._id.toString(),
      requestId: need.reqId,
      category: need.category,
      itemDescription: need.itemDescription,
      quantityNeeded: need.quantityNeeded,
      urgencyLevel: need.urgencyLevel,
      location: need.location,
      postedDate: need.createdAt.toISOString().split('T')[0],
      status: need.status,
      beneficiaryType: need.beneficiaryType,
      estimatedDuration: need.estimatedDuration
    };

    res.status(201).json({ success: true, data: formattedNeed });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update need status
router.patch('/needs/:id', async (req, res) => {
  try {
    const need = await OrganizationNeed.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!need) {
      return res.status(404).json({ success: false, message: 'Need not found' });
    }

    res.json({ success: true, data: need });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete need
router.delete('/needs/:id', async (req, res) => {
  try {
    const need = await OrganizationNeed.findByIdAndDelete(req.params.id);
    if (!need) {
      return res.status(404).json({ success: false, message: 'Need not found' });
    }
    res.json({ success: true, message: 'Need deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
