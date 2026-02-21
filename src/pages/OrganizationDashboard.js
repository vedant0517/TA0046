import React, { useState } from 'react';
import './OrganizationDashboard.css';

function OrganizationDashboard() {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProof, setSelectedProof] = useState(null);

  // Organization Profile Data
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

  // Current Needs/Requests
  const currentNeeds = [
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
      itemDescription: 'First Aid Kits, Bandages',
      quantityNeeded: '15 kits',
      urgencyLevel: 'High',
      location: 'Clinic - Central Zone',
      postedDate: '2026-02-18',
      status: 'Active',
      beneficiaryType: 'General Population',
      estimatedDuration: 'Ongoing'
    }
  ];

  // Incoming Donations
  const incomingDonations = [
    {
      id: 1,
      donationId: 'DON-0542',
      donorName: 'Rajesh Kumar',
      donorId: 'D-2026-145',
      category: 'Food',
      item: 'Rice Bags',
      quantity: '25 kg',
      assignedVolunteer: 'Sarah Johnson',
      volunteerId: 'VOL-2026-001',
      status: 'In Transit',
      pickupDate: '2026-02-21',
      expectedDelivery: '2026-02-21 03:00 PM',
      requirement: 'REQ-001'
    },
    {
      id: 2,
      donationId: 'DON-0543',
      donorName: 'Priya Sharma',
      donorId: 'D-2026-156',
      category: 'Clothes',
      item: 'Winter Jackets',
      quantity: '15 pieces',
      assignedVolunteer: 'Ahmed Hassan',
      volunteerId: 'VOL-2026-003',
      status: 'Picked Up',
      pickupDate: '2026-02-21',
      expectedDelivery: '2026-02-21 05:00 PM',
      requirement: 'N/A'
    },
    {
      id: 3,
      donationId: 'DON-0541',
      donorName: 'Tech Solutions Inc.',
      donorId: 'D-2026-089',
      category: 'Education',
      item: 'Notebooks & Supplies',
      quantity: '200 pieces',
      assignedVolunteer: 'Maria Garcia',
      volunteerId: 'VOL-2026-002',
      status: 'Delivered',
      pickupDate: '2026-02-20',
      expectedDelivery: '2026-02-20 05:30 PM',
      requirement: 'REQ-002'
    }
  ];

  // Assigned Volunteers
  const assignedVolunteers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      volunteerId: 'VOL-2026-001',
      status: 'Busy',
      currentTasks: 2,
      contact: '+1-555-0201',
      area: 'North District',
      tasksInProgress: ['DON-0542', 'DON-0546']
    },
    {
      id: 2,
      name: 'Maria Garcia',
      volunteerId: 'VOL-2026-002',
      status: 'Available',
      currentTasks: 0,
      contact: '+1-555-0202',
      area: 'Central Zone',
      tasksInProgress: []
    },
    {
      id: 3,
      name: 'Ahmed Hassan',
      volunteerId: 'VOL-2026-003',
      status: 'Busy',
      currentTasks: 1,
      contact: '+1-555-0203',
      area: 'South District',
      tasksInProgress: ['DON-0543']
    }
  ];

  // Proof & Verification
  const proofRecords = [
    {
      id: 1,
      donationId: 'DON-0541',
      donorName: 'Tech Solutions Inc.',
      pickupProof: { imageUrl: '📸', timestamp: '2026-02-20 10:15 AM', location: 'Office' },
      deliveryProof: { imageUrl: '📸', timestamp: '2026-02-20 05:30 PM', location: 'School' },
      status: 'Verified',
      verifiedBy: 'Admin - John Doe',
      verificationDate: '2026-02-20'
    },
    {
      id: 2,
      donationId: 'DON-0543',
      donorName: 'Priya Sharma',
      pickupProof: { imageUrl: '📸', timestamp: '2026-02-21 02:00 PM', location: 'Home' },
      deliveryProof: null,
      status: 'Pending',
      verifiedBy: 'Pending',
      verificationDate: 'Pending'
    },
    {
      id: 3,
      donationId: 'DON-0542',
      donorName: 'Rajesh Kumar',
      pickupProof: { imageUrl: '📸', timestamp: '2026-02-21 10:00 AM', location: 'Shop' },
      deliveryProof: null,
      status: 'In Progress',
      verifiedBy: 'In Progress',
      verificationDate: 'In Progress'
    }
  ];

  // Inventory/Distribution Log
  const inventoryLog = [
    {
      id: 1,
      date: '2026-02-20',
      type: 'Received',
      category: 'Education',
      item: 'Notebooks & Supplies',
      quantity: '200 pieces',
      donor: 'Tech Solutions Inc.',
      status: 'Stored'
    },
    {
      id: 2,
      date: '2026-02-20',
      type: 'Distributed',
      category: 'Education',
      item: 'Notebooks',
      quantity: '150 pieces',
      beneficiary: 'Community School',
      beneficiaryType: 'Students',
      status: 'Completed'
    },
    {
      id: 3,
      date: '2026-02-19',
      type: 'Received',
      category: 'Food',
      item: 'Rice Bags',
      quantity: '50 kg',
      donor: 'Anonymous',
      status: 'Stored'
    },
    {
      id: 4,
      date: '2026-02-19',
      type: 'Distributed',
      category: 'Food',
      item: 'Rice & Dal Mix',
      quantity: '40 kg',
      beneficiary: 'Children Shelter',
      beneficiaryType: 'Children',
      status: 'Completed'
    },
    {
      id: 5,
      date: '2026-02-18',
      type: 'Received',
      category: 'Clothes',
      item: 'Winter Jackets',
      quantity: '20 pieces',
      donor: 'Clothing Store XYZ',
      status: 'Stored'
    }
  ];

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'High': return '#d32f2f';
      case 'Medium': return '#f57c00';
      case 'Low': return '#388e3c';
      default: return '#1a237e';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Verified':
        return { bg: '#e8f5e9', text: '#1b5e20' };
      case 'Pending':
        return { bg: '#fff3e0', text: '#e65100' };
      case 'In Progress':
        return { bg: '#f3e5f5', text: '#6a1b9a' };
      case 'Delivered':
        return { bg: '#e3f2fd', text: '#0d47a1' };
      case 'In Transit':
        return { bg: '#eceff1', text: '#455a64' };
      default:
        return { bg: '#f5f5f5', text: '#424242' };
    }
  };

  return (
    <div className="organization-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Organization Dashboard</h1>
          <p>Manage donations, requests, and beneficiary coordination</p>
        </div>
      </div>

      {/* 1️⃣ Organization Profile Section */}
      <section className="dashboard-section">
        <h2 className="section-heading">1️⃣ Organization Profile</h2>
        <div className="profile-card">
          <div className="profile-left">
            <div className="profile-avatar">
              <span>🏢</span>
            </div>
            <div className="profile-info">
              <h3>{organizationProfile.name}</h3>
              <p className="org-id">ID: {organizationProfile.registrationId}</p>
              <p className="org-detail">📍 Areas Served: {organizationProfile.areasServed.join(', ')}</p>
              <p className="org-detail">📧 {organizationProfile.contact.email}</p>
              <p className="org-detail">📞 {organizationProfile.contact.phone}</p>
            </div>
          </div>

          <div className="profile-right">
            <div className="verification-section">
              <div className="verification-badge verified">
                ✓ {organizationProfile.verificationStatus}
              </div>
              <p className="verified-date">since {organizationProfile.verifiedDate}</p>
            </div>

            <div className="categories-section">
              <h4>Donation Categories Accepted</h4>
              <div className="categories-list">
                {organizationProfile.donationCategoriesAccepted.map((cat, idx) => (
                  <span key={idx} className="category-tag">{cat}</span>
                ))}
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-box">
                <p className="stat-number">{organizationProfile.totalDonationsReceived}</p>
                <p className="stat-label">Total Donations</p>
              </div>
              <div className="stat-box">
                <p className="stat-number">⭐ {organizationProfile.trustScore}</p>
                <p className="stat-label">Trust Score</p>
              </div>
            </div>
          </div>
        </div>
        <p className="section-note">📌 Builds donor trust</p>
      </section>

      {/* 2️⃣ Current Needs / Requests Management */}
      <section className="dashboard-section">
        <div className="section-header-with-btn">
          <h2 className="section-heading">2️⃣ Current Needs / Requests Management</h2>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>+ Create New Request</button>
        </div>

        {showForm && (
          <div className="request-form-card">
            <h3>Create Donation Request</h3>
            <form className="needs-form">
              <div className="form-group">
                <label>Donation Category</label>
                <select>
                  <option>Select Category</option>
                  <option>Food</option>
                  <option>Clothes</option>
                  <option>Education</option>
                  <option>Medical</option>
                  <option>Essentials</option>
                </select>
              </div>

              <div className="form-group">
                <label>Item Description</label>
                <textarea placeholder="Describe items needed..." rows="3"></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity Needed</label>
                  <input type="text" placeholder="e.g., 100 kg, 50 pieces" />
                </div>
                <div className="form-group">
                  <label>Urgency Level</label>
                  <select>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Location of Requirement</label>
                <input type="text" placeholder="Enter location" />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Post Request</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="needs-list">
          {currentNeeds.map(need => (
            <div key={need.id} className="need-card">
              <div className="need-header">
                <div>
                  <h3>{need.category} - {need.requestId}</h3>
                  <p>{need.itemDescription}</p>
                </div>
                <span className="urgency-badge" style={{ backgroundColor: getUrgencyColor(need.urgencyLevel) }}>
                  {need.urgencyLevel}
                </span>
              </div>

              <div className="need-details">
                <div className="detail-item">
                  <span className="label">Quantity:</span>
                  <span className="value">{need.quantityNeeded}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">{need.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">For:</span>
                  <span className="value">{need.beneficiaryType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Posted:</span>
                  <span className="value">{need.postedDate}</span>
                </div>
              </div>

              <button className="edit-btn">✏️ Edit</button>
            </div>
          ))}
        </div>
        <p className="section-note">📌 Solves mismatch between donations and real needs</p>
      </section>

      {/* 3️⃣ Incoming Donations Tracker */}
      <section className="dashboard-section">
        <h2 className="section-heading">3️⃣ Incoming Donations Tracker</h2>
        <div className="donations-tracker">
          {incomingDonations.map(donation => (
            <div key={donation.id} className="donation-tracker-card">
              <div className="donation-header">
                <div className="donation-info">
                  <h3>{donation.category} - {donation.donationId}</h3>
                  <p>👤 From: <strong>{donation.donorName}</strong> (ID: {donation.donorId})</p>
                  <p className="donation-item">📦 {donation.item} - {donation.quantity}</p>
                </div>
                <span className="status-badge" style={{ ...getStatusColor(donation.status) }}>
                  {donation.status}
                </span>
              </div>

              <div className="donation-details-grid">
                <div className="donation-detail">
                  <p className="label">Assigned Volunteer</p>
                  <p className="value">{donation.assignedVolunteer}</p>
                  <p className="sub-value">ID: {donation.volunteerId}</p>
                </div>
                <div className="donation-detail">
                  <p className="label">Pickup Date</p>
                  <p className="value">{donation.pickupDate}</p>
                </div>
                <div className="donation-detail">
                  <p className="label">Expected Delivery</p>
                  <p className="value">{donation.expectedDelivery}</p>
                </div>
                <div className="donation-detail">
                  <p className="label">Matches Request</p>
                  <p className="value">{donation.requirement}</p>
                </div>
              </div>

              <div className="donation-actions">
                <button className="action-btn">👁️ View Details</button>
                <button className="action-btn">💬 Contact Volunteer</button>
              </div>
            </div>
          ))}
        </div>
        <p className="section-note">📌 Ensures transparency and accountability</p>
      </section>

      {/* 4️⃣ Volunteer Coordination Panel */}
      <section className="dashboard-section">
        <h2 className="section-heading">4️⃣ Volunteer Coordination Panel</h2>
        <div className="volunteers-grid">
          {assignedVolunteers.map(volunteer => (
            <div key={volunteer.id} className="volunteer-card">
              <div className="volunteer-header">
                <div className="volunteer-avatar">👤</div>
                <div className="volunteer-name-info">
                  <h3>{volunteer.name}</h3>
                  <p className="volunteer-id">ID: {volunteer.volunteerId}</p>
                </div>
              </div>

              <div className="status-indicator">
                <p className={`status-label ${volunteer.status.toLowerCase()}`}>
                  ● {volunteer.status}
                </p>
              </div>

              <div className="volunteer-details">
                <div className="detail">
                  <span className="label">Current Tasks:</span>
                  <span className="value">{volunteer.currentTasks}</span>
                </div>
                <div className="detail">
                  <span className="label">Contact:</span>
                  <span className="value">{volunteer.contact}</span>
                </div>
                <div className="detail">
                  <span className="label">Area:</span>
                  <span className="value">{volunteer.area}</span>
                </div>
              </div>

              {volunteer.tasksInProgress.length > 0 && (
                <div className="tasks-in-progress">
                  <p className="label">Tasks in Progress:</p>
                  <div className="task-ids">
                    {volunteer.tasksInProgress.map((taskId, idx) => (
                      <span key={idx} className="task-id-badge">{taskId}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="volunteer-actions">
                <button className="coord-btn">📞 Call</button>
                <button className="coord-btn">💬 Chat</button>
                <button className="coord-btn">📊 View Tasks</button>
              </div>
            </div>
          ))}
        </div>
        <p className="section-note">📌 Reduces manual coordination</p>
      </section>

      {/* 5️⃣ Proof & Verification Section */}
      <section className="dashboard-section">
        <h2 className="section-heading">5️⃣ Proof & Verification Section</h2>
        <div className="proof-cards">
          {proofRecords.map(record => (
            <div key={record.id} className="proof-card">
              <div className="proof-header">
                <div>
                  <h3>{record.donationId}</h3>
                  <p>👤 {record.donorName}</p>
                </div>
                <span className={`proof-status ${record.status.toLowerCase()}`}>
                  {record.status}
                </span>
              </div>

              <div className="proof-content">
                <div className="proof-section">
                  <h4>📸 Pickup Proof</h4>
                  <div className="proof-image-placeholder">{record.pickupProof.imageUrl}</div>
                  <p className="proof-meta">🕐 {record.pickupProof.timestamp}</p>
                  <p className="proof-meta">📍 {record.pickupProof.location}</p>
                </div>

                {record.deliveryProof && (
                  <div className="proof-section">
                    <h4>📸 Delivery Proof</h4>
                    <div className="proof-image-placeholder">{record.deliveryProof.imageUrl}</div>
                    <p className="proof-meta">🕐 {record.deliveryProof.timestamp}</p>
                    <p className="proof-meta">📍 {record.deliveryProof.location}</p>
                  </div>
                )}
              </div>

              <div className="proof-verification">
                <p><strong>Verified By:</strong> {record.verifiedBy}</p>
                <p><strong>Date:</strong> {record.verificationDate}</p>
              </div>

              {record.status === 'Pending' && (
                <div className="proof-actions">
                  <button className="approve-btn">✓ Approve</button>
                  <button className="flag-btn">⚠️ Flag Issue</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="section-note">📌 Prevents fake or incomplete donations</p>
      </section>

      {/* 6️⃣ Inventory / Distribution Log */}
      <section className="dashboard-section">
        <h2 className="section-heading">6️⃣ Inventory / Distribution Log</h2>
        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Donor / Beneficiary</th>
                <th>Beneficiary Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventoryLog.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>
                    <span className={`type-badge ${entry.type.toLowerCase()}`}>
                      {entry.type}
                    </span>
                  </td>
                  <td>{entry.category}</td>
                  <td>{entry.item}</td>
                  <td>{entry.quantity}</td>
                  <td>{entry.donor || entry.beneficiary}</td>
                  <td>{entry.beneficiaryType || '-'}</td>
                  <td>
                    <span className="inventory-status">{entry.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="section-note">📌 Helps NGOs manage resources efficiently</p>
      </section>

      {/* Quick Stats */}
      <section className="dashboard-section">
        <h2 className="section-heading">📊 Quick Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-title">Active Requests</p>
            <p className="stat-value">{currentNeeds.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Incoming Donations</p>
            <p className="stat-value">{incomingDonations.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Active Volunteers</p>
            <p className="stat-value">{assignedVolunteers.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Verified Donations</p>
            <p className="stat-value">{proofRecords.filter(p => p.status === 'Verified').length}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrganizationDashboard;
