import React, { useState, useEffect } from 'react';
import './DonorDashboard.css';
import { addDonation, getDonorDonations, getVerifiedDonations } from '../utils/donationManager';

function DonorDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    itemType: '',
    quantity: '',
    pickupLocation: '',
    pickupTime: ''
  });
  const [createdDonations, setCreatedDonations] = useState([]);
  const [verifiedDonations, setVerifiedDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load donations from localStorage on mount
  useEffect(() => {
    const donations = getDonorDonations();
    setCreatedDonations(donations);
    
    // Load verified donations
    const verified = getVerifiedDonations();
    setVerifiedDonations(verified);
    
    // Create notifications for recently verified donations
    const recentVerified = verified.filter(v => {
      const verifiedTime = new Date(v.verifiedAt);
      const now = new Date();
      const hoursDiff = (now - verifiedTime) / (1000 * 60 * 60);
      return hoursDiff < 24; // Show notifications for donations verified in last 24 hours
    });
    
    setNotifications(recentVerified.map(v => ({
      id: v.id,
      message: `🎉 Donation successfully delivered to ${v.needyPersonName} in ${v.needyPersonArea}!`,
      time: v.verifiedAt,
      type: 'success'
    })));
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCategoryName = (categoryId) => {
    const cat = donationCategories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedCategory || !formData.itemType || !formData.quantity || !formData.pickupLocation || !formData.pickupTime) {
      alert('Please fill all fields');
      return;
    }

    const newDonation = addDonation({
      category: getCategoryName(selectedCategory),
      itemType: formData.itemType,
      quantity: formData.quantity,
      pickupLocation: formData.pickupLocation,
      pickupTime: formData.pickupTime
    });

    setCreatedDonations(prev => [...prev, newDonation]);
    
    // Reset form
    setFormData({ itemType: '', quantity: '', pickupLocation: '', pickupTime: '' });
    setSelectedCategory('');
    setShowRequestForm(false);
    
    alert('Donation created successfully! This donation is now visible to volunteers and organizations.');
  };

  const donationCategories = [
    { id: 'food', icon: '🍚', name: 'Food', description: 'Dry food, cooked meals, groceries' },
    { id: 'clothes', icon: '👕', name: 'Clothes', description: 'New / usable clothes' },
    { id: 'education', icon: '📚', name: 'Education', description: 'Books, stationery, bags' },
    { id: 'medical', icon: '🩺', name: 'Medical Supplies', description: 'First aid, medicines' },
    { id: 'children', icon: '🧸', name: 'Children Essentials', description: 'Toys, hygiene kits' },
    { id: 'daily', icon: '🏠', name: 'Daily Essentials', description: 'Blankets, utensils' },
  ];

  const donationHistory = [
    { category: 'Food', item: 'Rice', quantity: '25 kg', date: '2026-02-15', status: 'Delivered', impact: 'Helped 15 children' },
    { category: 'Clothes', item: 'Winter Jackets', quantity: '10 pieces', date: '2026-02-10', status: 'In Transit', impact: 'Pending' },
    { category: 'Education', item: 'Notebooks', quantity: '50 pieces', date: '2026-02-05', status: 'Delivered', impact: 'Helped 25 students' },
  ];

  return (
    <div className="donor-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Donor</h1>
            <p>Make a difference by donating essential items to those in need</p>
          </div>
          <div className="header-image">
            <img src="/images/dashboard-screenshot.png" alt="Dashboard showcase" />
          </div>
        </div>
      </div>

      {/* Donation Categories Section */}
      <section className="dashboard-section">
        <h2 className="section-heading">📦 Donation Categories</h2>
        <div className="categories-grid">
          {donationCategories.map((category) => (
            <div 
              key={category.id} 
              className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedCategory(category.id);
                setShowRequestForm(true);
              }}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Create Donation Request */}
      {showRequestForm && (
        <section className="dashboard-section">
          <h2 className="section-heading">📝 Create Donation Request</h2>
          <div className="donation-form-card">
            <form className="donation-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {donationCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Item Type</label>
                <input 
                  type="text" 
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleFormChange}
                  placeholder="e.g., Rice, Notebooks, Blankets" 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Quantity (units)</label>
                <input 
                  type="text" 
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  placeholder="e.g., 25 kg, 50 pieces" 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Pickup Location</label>
                <input 
                  type="text" 
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleFormChange}
                  placeholder="Enter your address" 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Preferred Pickup Time</label>
                <input 
                  type="datetime-local" 
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn">Submit Donation Request</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowRequestForm(false);
                  setFormData({ itemType: '', quantity: '', pickupLocation: '', pickupTime: '' });
                  setSelectedCategory('');
                }}
                style={{ marginLeft: '1rem', background: '#999', cursor: 'pointer', border: 'none', padding: '1rem 2rem', borderRadius: '50px', color: 'white', fontWeight: '600' }}
              >
                Cancel
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Active Donations - Status Tracker */}
      {createdDonations.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-heading">📍 Active Donation Status</h2>
          {createdDonations.map(donation => (
            <div key={donation.id} className="status-card">
              <div className="status-header">
                <h3>{donation.category} - {donation.item}</h3>
                <span className="status-badge">{donation.status}</span>
              </div>
              
              <div className="donation-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <p><strong>Donation ID:</strong> {donation.donationId}</p>
                  <p><strong>Quantity:</strong> {donation.quantity}</p>
                </div>
                <div>
                  <p><strong>Pickup Location:</strong> {donation.pickupLocation}</p>
                  <p><strong>Pickup Time:</strong> {new Date(donation.pickupTime).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="status-tracker">
                <div className={`status-step ${['Pending', 'Accepted by Volunteer', 'Picked Up', 'In Transit', 'Delivered'].includes(donation.status) ? 'completed' : ''}`}>
                  <div className="step-icon">✓</div>
                  <p>Donation Created</p>
                </div>
                <div className={`status-line ${['Accepted by Volunteer', 'Picked Up', 'In Transit', 'Delivered'].includes(donation.status) ? 'completed' : ''}`}></div>
                <div className={`status-step ${['Accepted by Volunteer', 'Picked Up', 'In Transit', 'Delivered'].includes(donation.status) ? 'completed' : ''}`}>
                  <div className="step-icon">✓</div>
                  <p>Volunteer Accepted</p>
                </div>
                <div className={`status-line ${['Picked Up', 'In Transit', 'Delivered'].includes(donation.status) ? 'completed' : ''}`}></div>
                <div className={`status-step ${['Picked Up', 'In Transit', 'Delivered'].includes(donation.status) ? 'completed' : ''}`}>
                  <div className="step-icon">✓</div>
                  <p>Picked Up</p>
                </div>
                <div className={`status-line ${['In Transit', 'Delivered'].includes(donation.status) ? 'completed' : ''}`}></div>
                <div className={`status-step ${donation.status === 'Delivered' ? 'completed' : ''}`}>
                  <div className="step-icon">✓</div>
                  <p>Delivered</p>
                </div>
              </div>

              {donation.assignedVolunteer && (
                <div className="volunteer-panel">
                  <h4>👥 Assigned Volunteer</h4>
                  <div className="volunteer-info">
                    <p><strong>Name:</strong> {donation.assignedVolunteer}</p>
                    <p><strong>Status:</strong> {donation.volunteerResponse === 'accepted' ? '✓ Accepted' : '✗ Declined'}</p>
                  </div>
                </div>
              )}

              {donation.status === 'Pending' && (
                <div className="status-info" style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px', marginTop: '1rem' }}>
                  <p>⏳ Waiting for a volunteer to accept this donation...</p>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <section className="dashboard-section notifications-section">
          <h2 className="section-heading">🔔 Recent Notifications</h2>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div key={notification.id} className={`notification-card ${notification.type}`}>
                <div className="notification-icon">✅</div>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OTP Verified & Successful Donations */}
      {verifiedDonations.length > 0 && (
        <section className="dashboard-section verified-donations-section">
          <h2 className="section-heading">✅ OTP Verified & Successful Donations</h2>
          <p className="section-description">Donations that have been successfully delivered and verified via OTP</p>
          
          <div className="verified-donations-grid">
            {verifiedDonations.map(donation => (
              <div key={donation.id} className="verified-donation-card">
                <div className="verified-card-header">
                  <span className="verified-badge">✅ Verified</span>
                  <span className="verification-id">{donation.verificationId}</span>
                </div>
                
                <div className="verified-card-body">
                  <div className="needy-info">
                    <h4>👤 Delivered To</h4>
                    <p className="needy-name">{donation.needyPersonName}</p>
                    <p className="needy-area">📍 {donation.needyPersonArea}</p>
                    <p className="needy-category">🏷️ {donation.needyPersonCategory}</p>
                  </div>
                  
                  <div className="verification-details">
                    <p><strong>📱 Contact:</strong> {donation.phoneNumber}</p>
                    <p><strong>🕐 Verified At:</strong> {donation.verifiedAt}</p>
                    <p><strong>📦 Status:</strong> <span className="success-status">{donation.status}</span></p>
                  </div>
                </div>
                
                <div className="verified-card-footer">
                  <span className="impact-badge">🎉 Making a difference!</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Donation History */}
      <section className="dashboard-section">
        <h2 className="section-heading">📋 Donation History</h2>
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Item & Quantity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.map((donation, index) => (
                <tr key={index}>
                  <td>{donation.category}</td>
                  <td>{donation.item} - {donation.quantity}</td>
                  <td>{donation.date}</td>
                  <td>
                    <span className={`status-pill ${donation.status.toLowerCase().replace(' ', '-')}`}>
                      {donation.status}
                    </span>
                  </td>
                  <td>{donation.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}

export default DonorDashboard;
