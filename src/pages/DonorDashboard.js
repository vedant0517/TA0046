import React, { useState } from 'react';
import './DonorDashboard.css';

function DonorDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

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

  const currentDonations = [
    {
      id: 1,
      category: 'Food',
      item: 'Rice Bags',
      status: 'Volunteer Assigned',
      volunteer: 'John Smith',
      beneficiary: 'Children Shelter - Hope City',
      pickupTime: '2026-02-21 10:00 AM'
    }
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
            <form className="donation-form">
              <div className="form-group">
                <label>Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {donationCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Item Type</label>
                <input type="text" placeholder="e.g., Rice, Notebooks, Blankets" />
              </div>
              
              <div className="form-group">
                <label>Quantity (units)</label>
                <input type="number" placeholder="Enter quantity" />
              </div>
              
              <div className="form-group">
                <label>Pickup Location</label>
                <input type="text" placeholder="Enter your address" />
              </div>
              
              <div className="form-group">
                <label>Preferred Pickup Time</label>
                <input type="datetime-local" />
              </div>
              
              <button type="submit" className="submit-btn">Submit Donation Request</button>
            </form>
          </div>
        </section>
      )}

      {/* Active Donations - Status Tracker */}
      {currentDonations.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-heading">📍 Active Donation Status</h2>
          {currentDonations.map(donation => (
            <div key={donation.id} className="status-card">
              <div className="status-header">
                <h3>{donation.category} - {donation.item}</h3>
                <span className="status-badge">{donation.status}</span>
              </div>
              
              <div className="status-tracker">
                <div className="status-step completed">
                  <div className="step-icon">✓</div>
                  <p>Donation Registered</p>
                </div>
                <div className="status-line completed"></div>
                <div className="status-step completed">
                  <div className="step-icon">✓</div>
                  <p>Volunteer Assigned</p>
                </div>
                <div className="status-line"></div>
                <div className="status-step">
                  <div className="step-icon">○</div>
                  <p>Pickup Completed</p>
                </div>
                <div className="status-line"></div>
                <div className="status-step">
                  <div className="step-icon">○</div>
                  <p>Delivered to Beneficiary</p>
                </div>
              </div>

              {/* Volunteer Coordination */}
              <div className="volunteer-panel">
                <h4>👥 Assigned Volunteer</h4>
                <div className="volunteer-info">
                  <p><strong>Name:</strong> {donation.volunteer}</p>
                  <p><strong>Pickup Time:</strong> {donation.pickupTime}</p>
                  <div className="contact-buttons">
                    <button className="contact-btn">💬 Chat</button>
                    <button className="contact-btn">📞 Call</button>
                  </div>
                </div>
              </div>

              {/* Beneficiary Details */}
              <div className="beneficiary-panel">
                <h4>🏘️ Beneficiary Details</h4>
                <div className="beneficiary-info">
                  <p><strong>Type:</strong> Children Shelter</p>
                  <p><strong>Location:</strong> {donation.beneficiary}</p>
                  <p><strong>Need:</strong> Food supplies for 20 children in shelter</p>
                  <span className="verified-badge">✓ Verified</span>
                </div>
              </div>
            </div>
          ))}
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

      {/* Impact View */}
      <section className="dashboard-section">
        <h2 className="section-heading">💝 Your Impact</h2>
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-image-placeholder">
              <span>📸</span>
            </div>
            <div className="impact-content">
              <h4>Food Distribution - Feb 15</h4>
              <p className="impact-message">"Thank you for the rice donation! It helped feed our children for a whole week." - Hope Shelter</p>
              <span className="impact-tag">Helped 15 children</span>
            </div>
          </div>
          
          <div className="impact-card">
            <div className="impact-image-placeholder">
              <span>📸</span>
            </div>
            <div className="impact-content">
              <h4>Education Support - Feb 5</h4>
              <p className="impact-message">"The notebooks will help our students continue their studies. Grateful for your support!" - Community School</p>
              <span className="impact-tag">Helped 25 students</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DonorDashboard;
