import React, { useState, useEffect } from 'react';
import './DonorDashboard.css';
import { addDonation, getDonorDonations, getVerifiedDonations } from '../utils/donationManager';
import DonationTracker from '../components/DonationTracker';

function DonorDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    itemType: '',
    quantity: '',
    pickupLocation: '',
    pickupTime: '',
    // Detailed pickup location fields
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    // Book-specific fields
    bookTitles: '',
    subject: '',
    gradeLevel: '',
    condition: '',
    language: 'English'
  });
  const [createdDonations, setCreatedDonations] = useState([]);
  const [verifiedDonations, setVerifiedDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);

  // Load donations from API on mount
  useEffect(() => {
    const fetchDonations = async () => {
      const donations = await getDonorDonations();
      setCreatedDonations(donations);
      
      // Load verified donations
      const verified = await getVerifiedDonations();
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
    };
    
    fetchDonations();
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedCategory || !formData.itemType || !formData.quantity || 
        !formData.addressLine1 || !formData.city || !formData.state || 
        !formData.pincode || !formData.pickupTime) {
      alert('Please fill all required fields');
      return;
    }

    // Validate pincode
    if (formData.pincode.length !== 6 || !/^[0-9]{6}$/.test(formData.pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    // Construct full pickup location address
    const fullAddress = [
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
      `${formData.state} - ${formData.pincode}`,
      formData.landmark ? `Near ${formData.landmark}` : ''
    ].filter(Boolean).join(', ');

    // Geocode address if coordinates not available
    let coordinates = currentCoordinates;
    if (!coordinates) {
      try {
        const geocodeQuery = `${formData.addressLine1}, ${formData.city}, ${formData.state}, ${formData.pincode}, India`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(geocodeQuery)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          coordinates = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
          console.log('📍 Geocoded address to coordinates:', coordinates);
        } else {
          console.warn('⚠️ Could not geocode address');
        }
      } catch (error) {
        console.error('❌ Geocoding error:', error);
      }
    }

    const donationData = {
      donorId: `DONOR-${Date.now()}`, // Generate unique donor ID
      donorName: 'Anonymous Donor', // Can be updated with actual donor name if available
      category: getCategoryName(selectedCategory),
      item: formData.itemType, // Backend expects 'item' field
      quantity: formData.quantity,
      pickupLocation: fullAddress,
      pickupTime: formData.pickupTime,
      // Store coordinates (from auto-location or geocoding)
      coordinates: coordinates,
      // Store detailed address info
      addressDetails: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark
      }
    };

    // Add book-specific data if it's an education/book donation
    if (selectedCategory === 'education' || formData.itemType.toLowerCase().includes('book')) {
      donationData.bookDetails = {
        titles: formData.bookTitles,
        subject: formData.subject,
        gradeLevel: formData.gradeLevel,
        condition: formData.condition,
        language: formData.language
      };
    }

    const newDonation = await addDonation(donationData);

    setCreatedDonations(prev => [...prev, newDonation]);
    
    // Reset form and coordinates
    setCurrentCoordinates(null);
    setFormData({ 
      itemType: '', 
      quantity: '', 
      pickupLocation: '',
      pickupTime: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      bookTitles: '',
      subject: '',
      gradeLevel: '',
      condition: '',
      language: 'English'
    });
    setSelectedCategory('');
    setShowRequestForm(false);
    
    alert('Donation created successfully! This donation is now visible to volunteers and organizations.');
  };

  // Function to fetch current location automatically
  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Using Nominatim reverse geocoding API (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch address');
          }
          
          const data = await response.json();
          const address = data.address;
          
          // Map the response to our form fields
          const addressLine1 = [
            address.house_number,
            address.building,
            address.road,
            address.street
          ].filter(Boolean).join(', ') || '';
          
          const addressLine2 = [
            address.neighbourhood,
            address.suburb,
            address.quarter
          ].filter(Boolean).join(', ') || '';
          
          const city = address.city || address.town || address.village || address.municipality || '';
          const state = address.state || '';
          const pincode = address.postcode || '';
          const landmark = address.amenity || address.shop || '';
          
          // Update form with fetched location
          setFormData(prev => ({
            ...prev,
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            city: city,
            state: state,
            pincode: pincode,
            landmark: landmark
          }));
          
          // Store coordinates for map
          setCurrentCoordinates({
            lat: latitude,
            lng: longitude
          });
          
          setFetchingLocation(false);
          alert('✅ Location fetched successfully! Please verify and add any missing details.');
          
        } catch (error) {
          console.error('Error fetching address:', error);
          setFetchingLocation(false);
          alert('❌ Could not fetch address details. Please enter manually.');
        }
      },
      (error) => {
        setFetchingLocation(false);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert('❌ Location access denied. Please enable location permissions in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('❌ Location information is unavailable. Please enter address manually.');
            break;
          case error.TIMEOUT:
            alert('❌ Location request timed out. Please try again or enter address manually.');
            break;
          default:
            alert('❌ An error occurred while fetching location. Please enter address manually.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
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

              {/* Book-specific fields - shown when education category is selected */}
              {selectedCategory === 'education' && (
                <>
                  <div className="book-donation-notice">
                    <h4>📚 Book Donation Details</h4>
                    <p>Please provide additional information for book donations to help match them with schools in need.</p>
                  </div>

                  <div className="form-group">
                    <label>Book Titles / Names <span style={{fontSize: '0.85em', color: '#666'}}>(separate with commas)</span></label>
                    <textarea
                      name="bookTitles"
                      value={formData.bookTitles}
                      onChange={handleFormChange}
                      placeholder="e.g., Mathematics Grade 8, English Grammar, Science Textbook"
                      rows="3"
                      style={{resize: 'vertical', padding: '0.75rem', fontSize: '1rem', fontFamily: 'inherit'}}
                    />
                  </div>

                  <div className="form-group">
                    <label>Subject/Category</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English">English / Language</option>
                      <option value="Social Studies">Social Studies / History</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Arts">Arts / Drawing</option>
                      <option value="Story Books">Story Books</option>
                      <option value="Reference">Reference / Encyclopedia</option>
                      <option value="General">General / Mixed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Grade Level</label>
                    <select
                      name="gradeLevel"
                      value={formData.gradeLevel}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Grade Level</option>
                      <option value="Primary (1-5)">Primary (Grades 1-5)</option>
                      <option value="Middle (6-8)">Middle School (Grades 6-8)</option>
                      <option value="High (9-12)">High School (Grades 9-12)</option>
                      <option value="College">College / University</option>
                      <option value="All Ages">All Ages / Mixed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Book Condition</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Condition</option>
                      <option value="New">New (Unused)</option>
                      <option value="Like New">Like New (Minimal use)</option>
                      <option value="Good">Good (Some wear)</option>
                      <option value="Fair">Fair (Well-used but readable)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Language</label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleFormChange}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Kannada">Kannada</option>
                      <option value="Bengali">Bengali</option>
                      <option value="Gujarati">Gujarati</option>
                      <option value="Multiple">Multiple Languages</option>
                    </select>
                  </div>
                </>
              )}
              
              {/* Pickup Location Section */}
              <div className="pickup-location-section">
                <h4 className="section-subtitle">📍 Pickup Location Details</h4>
                <p className="section-note">Please provide complete address for accurate pickup</p>
                
                <button 
                  type="button" 
                  className="fetch-location-btn"
                  onClick={fetchCurrentLocation}
                  disabled={fetchingLocation}
                >
                  {fetchingLocation ? (
                    <>
                      <span className="spinner"></span> Fetching Location...
                    </>
                  ) : (
                    <>🎯 Use Current Location</>
                  )}
                </button>
                
                {!currentCoordinates && (
                  <div className="location-tip">
                    �️ <strong>GPS Tracking:</strong> Use "Current Location" button to capture precise latitude/longitude coordinates for accurate map location!
                  </div>
                )}
                
                {currentCoordinates && (
                  <div className="location-tip" style={{background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)', borderColor: '#4caf50', color: '#2e7d32'}}>
                    ✅ <strong>GPS Enabled:</strong> Precise coordinates captured ({currentCoordinates.lat.toFixed(4)}°, {currentCoordinates.lng.toFixed(4)}°)
                  </div>
                )}
                
                <div className="form-group">
                  <label>Address Line 1 <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleFormChange}
                    placeholder="House No., Building Name, Street" 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Address Line 2 (Optional)</label>
                  <input 
                    type="text" 
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleFormChange}
                    placeholder="Area, Locality" 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City <span className="required">*</span></label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      placeholder="e.g., Bangalore" 
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>State <span className="required">*</span></label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Delhi">Delhi</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Assam">Assam</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Pincode <span className="required">*</span></label>
                    <input 
                      type="text" 
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleFormChange}
                      placeholder="6-digit pincode" 
                      pattern="[0-9]{6}"
                      maxLength="6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Landmark (Optional)</label>
                    <input 
                      type="text" 
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleFormChange}
                      placeholder="Near Metro Station, Mall, etc." 
                    />
                  </div>
                </div>
                
                <div className="location-preview">
                  <strong>📍 Complete Address:</strong>
                  <p>
                    {formData.addressLine1 && `${formData.addressLine1}, `}
                    {formData.addressLine2 && `${formData.addressLine2}, `}
                    {formData.city && `${formData.city}, `}
                    {formData.state && `${formData.state} - `}
                    {formData.pincode}
                    {formData.landmark && ` (Near ${formData.landmark})`}
                  </p>
                </div>
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
                  setCurrentCoordinates(null);
                  setFormData({ 
                    itemType: '', 
                    quantity: '', 
                    pickupLocation: '',
                    pickupTime: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    pincode: '',
                    landmark: '',
                    bookTitles: '',
                    subject: '',
                    gradeLevel: '',
                    condition: '',
                    language: 'English'
                  });
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

      {/* Active Donations - Real-Time Tracking */}
      {createdDonations.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-heading">📍 Real-Time Donation Tracking</h2>
          <p className="section-description">Track your donations with live location updates and volunteer information</p>
          {createdDonations.map(donation => (
            <DonationTracker key={donation.id} donation={donation} />
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
