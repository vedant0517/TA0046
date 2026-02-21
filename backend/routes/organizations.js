const express = require('express');
const router = express.Router();

// Mock data for organizations
const organizationNeeds = [
  {
    id: 1,
    requestId: 'REQ-001',
    category: 'Food',
    itemDescription: 'Rice, Dal, Cooking Oil',
    quantityNeeded: '100 kg',
    urgencyLevel: 'High',
    location: 'Children Shelter - North District',
    postedDate: '2026-02-20',
    status: 'Active',
    beneficiaryType: 'Children (25 kids)',
    estimatedDuration: 'Monthly'
  },
  {
    id: 2,
    requestId: 'REQ-002',
    category: 'Education',
    itemDescription: 'Notebooks, Pencils, Books',
    quantityNeeded: '200 pieces',
    urgencyLevel: 'Medium',
    location: 'Community School - South District',
    postedDate: '2026-02-19',
    status: 'Active',
    beneficiaryType: 'Students (40 students)',
    estimatedDuration: 'Quarterly'
  },
  {
    id: 3,
    requestId: 'REQ-003',
    category: 'Medical',
    itemDescription: 'First Aid Kits, Medicines',
    quantityNeeded: '50 kits',
    urgencyLevel: 'High',
    location: 'Health Camp - Central Zone',
    postedDate: '2026-02-18',
    status: 'Active',
    beneficiaryType: 'General Public',
    estimatedDuration: 'Immediate'
  }
];

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

// Get organization needs/requests
router.get('/needs', (req, res) => {
  try {
    res.json({ success: true, data: organizationNeeds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new need/request
router.post('/needs', (req, res) => {
  try {
    const newNeed = {
      id: organizationNeeds.length + 1,
      requestId: `REQ-${String(organizationNeeds.length + 1).padStart(3, '0')}`,
      ...req.body,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    organizationNeeds.push(newNeed);
    res.status(201).json({ success: true, data: newNeed });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update need status
router.patch('/needs/:id', (req, res) => {
  try {
    const need = organizationNeeds.find(n => n.id === parseInt(req.params.id));
    if (!need) {
      return res.status(404).json({ success: false, message: 'Need not found' });
    }
    Object.assign(need, req.body);
    res.json({ success: true, data: need });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete need
router.delete('/needs/:id', (req, res) => {
  try {
    const index = organizationNeeds.findIndex(n => n.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Need not found' });
    }
    organizationNeeds.splice(index, 1);
    res.json({ success: true, message: 'Need deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
