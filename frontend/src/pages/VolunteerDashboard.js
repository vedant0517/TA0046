import React, { useState, useEffect } from 'react';
import './VolunteerDashboard.css';
import { getPendingDonations, acceptDonation, declineDonation, addVerifiedDonation, getVerifiedDonations, getNeedyPeople, sendOTP, verifyOTP, pickupDonation, markInTransit, markDelivered, updateDonationLocation } from '../utils/donationManager';
import LeafletMap from '../components/LeafletMap';

function VolunteerDashboard({ user }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedNeedy, setSelectedNeedy] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [assignedNeedy, setAssignedNeedy] = useState([]);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [needyPeople, setNeedyPeople] = useState([]);

  // Fetch needy people from API
  useEffect(() => {
    const fetchNeedyPeople = async () => {
      try {
        const people = await getNeedyPeople();
        setNeedyPeople(people);
      } catch (error) {
        console.error('Error fetching needy people:', error);
      }
    };
    fetchNeedyPeople();
  }, []);

  const handleNeedySelect = (person) => {
    setSelectedNeedy(person);
    setPhoneNumber('');
    setShowOtpInput(false);
    setEnteredOtp('');
    setOtpSent(false);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    try {
      // Call backend API to send OTP - use needyId field from database
      const result = await sendOTP(phoneNumber, selectedNeedy.needyId);

      // Store the OTP returned from backend (for demo)
      setGeneratedOtp(result.demoOTP);
      setShowOtpInput(true);
      setOtpSent(true);

      // Simple success message - OTP is now displayed on screen
      alert(`📱 OTP sent successfully to ${phoneNumber}!`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP: ' + error.message);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    try {
      // Call backend API to verify OTP - use needyId field from database
      const result = await verifyOTP(phoneNumber, selectedNeedy.needyId, enteredOtp);

      // OTP verified successfully
      const verifiedData = {
        ...selectedNeedy,
        phone: phoneNumber,
        verified: true,
        verifiedAt: new Date().toLocaleString()
      };

      setAssignedNeedy(prev => [...prev, verifiedData]);

      alert(`✅ OTP Verified Successfully!\n\n🎉 Donation to ${selectedNeedy.name} has been completed and verified.`);

      // Reset all states
      setSelectedNeedy(null);
      setPhoneNumber('');
      setShowOtpInput(false);
      setEnteredOtp('');
      setOtpSent(false);
      setGeneratedOtp('');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('❌ Invalid OTP or verification failed: ' + error.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      // Use needyId field from database
      const result = await sendOTP(phoneNumber, selectedNeedy.needyId);
      setGeneratedOtp(result.demoOTP);
      setEnteredOtp('');
      alert(`� New OTP sent successfully!`);
    } catch (error) {
      alert('Error resending OTP: ' + error.message);
    }
  };

  const handleCancelOtp = () => {
    setShowOtpInput(false);
    setEnteredOtp('');
    setOtpSent(false);
    setGeneratedOtp('');
  };

  // Volunteer Profile Data — uses logged-in user
  const volunteerProfile = {
    name: user?.name || 'Volunteer',
    volunteerId: user?.userId || user?._id || 'VOL-0000',
    assignedArea: 'Hope City - North District',
    availability: 'Available',
    verificationStatus: 'Verified',
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    totalDeliveries: assignedNeedy.length,
    rating: 4.8
  };

  // Load pending donations from API
  useEffect(() => {
    const fetchDonations = async () => {
      const pendingDonations = await getPendingDonations();

      // Convert donations to task format
      const tasksFromDonations = pendingDonations.map((donation, index) => ({
        id: donation._id || donation.donationId,
        taskId: donation.donationId,
        donorName: donation.donorName,
        donorId: donation.donorId,
        category: donation.category,
        pickupLocation: donation.pickupLocation,
        deliveryLocation: 'Organization Warehouse',
        priority: 'Medium',
        status: donation.status === 'Pending' ? 'Pending' : 'Accepted by Volunteer',
        pickupTime: new Date(donation.pickupTime).toLocaleString(),
        assignedTime: new Date(donation.createdDate).toLocaleString(),
        items: `${donation.quantity} ${donation.item}`,
        distance: 'TBD',
        estimatedTime: 'TBD',
        donationId: donation._id || donation.donationId,
        quantity: donation.quantity,
        item: donation.item,
        createdDate: donation.createdDate,
        isFromStorage: true
      }));

      setAllTasks(tasksFromDonations);

      // Load verified donations from API
      const verified = await getVerifiedDonations();
      const verifiedFormatted = verified.map(v => ({
        id: v.needyPersonId,
        name: v.needyPersonName,
        area: v.needyPersonArea,
        category: v.needyPersonCategory,
        phone: v.phoneNumber,
        verified: true,
        verifiedAt: v.verifiedAt
      }));
      setAssignedNeedy(verifiedFormatted);
    };

    fetchDonations();
  }, []);

  const handleAcceptDonation = async (taskId) => {
    const task = allTasks.find(t => t.isFromStorage && t.donationId === taskId);
    if (task) {
      await acceptDonation(task.donationId, {
        name: volunteerProfile.name,
        volunteerId: volunteerProfile.volunteerId,
        response: 'accepted'
      });

      // Update local state
      setAllTasks(prevTasks =>
        prevTasks.map(t =>
          t.donationId === taskId ? { ...t, status: 'Accepted by Volunteer' } : t
        )
      );

      alert(`✓ Donation ${task.taskId} accepted! You can now view the map and details.`);
      setSelectedTask({ ...task, status: 'Accepted by Volunteer' });
    }
  };

  const handleDeclineDonation = async (taskId) => {
    const task = allTasks.find(t => t.isFromStorage && t.donationId === taskId);
    if (task) {
      await declineDonation(task.donationId, {
        name: volunteerProfile.name,
        volunteerId: volunteerProfile.volunteerId,
        response: 'declined'
      });

      // Remove from tasks
      setAllTasks(prevTasks =>
        prevTasks.filter(t => t.donationId !== taskId)
      );

      alert(`✗ Donation ${task.taskId} declined.`);
      if (selectedTask?.donationId === taskId) {
        setSelectedTask(null);
      }
    }
  };

  const [updatingLocation, setUpdatingLocation] = useState(false);

  const handleUpdateLocation = async (task) => {
    setUpdatingLocation(true);
    try {
      const coords = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser"));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
          (err) => reject(new Error("Failed to get location: " + err.message)),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      await updateDonationLocation(task.donationId, {
        coordinates: coords,
        note: `Live tracking update from volunteer`
      });
      alert('📍 Live location updated successfully!');
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Could not update live location: ' + error.message);
    } finally {
      setUpdatingLocation(false);
    }
  };

  const getStatusSteps = (currentStatus) => {
    const steps = ['Accepted by Volunteer', 'Picked Up', 'In Transit', 'Delivered'];
    const currentIdx = steps.indexOf(currentStatus);
    return steps.map((step, idx) => ({
      step: step === 'Accepted by Volunteer' ? 'Accepted' : step,
      completed: idx <= currentIdx
    }));
  };

  const getNextStatus = (currentStatus) => {
    const flow = ['Pending', 'Accepted by Volunteer', 'Picked Up', 'In Transit', 'Delivered'];
    const idx = flow.indexOf(currentStatus);
    if (idx < flow.length - 1) return flow[idx + 1];
    return null;
  };

  const handleStatusUpdate = async (task) => {
    const nextStatus = getNextStatus(task.status);
    if (!nextStatus) {
      alert('This donation has already been delivered!');
      return;
    }

    try {
      // Try to get live coordinates
      let coords = null;
      try {
        coords = await new Promise((resolve) => {
          if (!navigator.geolocation) {
            resolve(null);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
            () => resolve(null), // Ignore error, just fallback to null
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        });
      } catch (err) {
        console.error("Could not get coordinates", err);
      }

      if (nextStatus === 'Picked Up') {
        await pickupDonation(task.donationId, {
          name: volunteerProfile.name,
          volunteerId: volunteerProfile.volunteerId
        }, {
          currentLocation: task.pickupLocation,
          coordinates: coords,
          destinationAddress: task.deliveryLocation,
          estimatedDelivery: 'Estimated 1 hour'
        });
      } else if (nextStatus === 'In Transit') {
        await markInTransit(task.donationId, {
          address: task.pickupLocation,
          coordinates: coords,
          distanceCovered: '2 km',
          note: 'Volunteer is en route to delivery location'
        });
      } else if (nextStatus === 'Delivered') {
        await markDelivered(task.donationId, {
          location: task.deliveryLocation,
          coordinates: coords,
          note: 'Donation successfully delivered'
        });
      }

      // Update local state
      setAllTasks(prevTasks =>
        prevTasks.map(t =>
          t.donationId === task.donationId ? { ...t, status: nextStatus } : t
        )
      );

      if (selectedTask?.donationId === task.donationId) {
        setSelectedTask({ ...task, status: nextStatus });
      }

      const emoji = nextStatus === 'Picked Up' ? '📦' : nextStatus === 'In Transit' ? '🚚' : '✅';
      alert(`${emoji} Status updated to: ${nextStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + error.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#d32f2f';
      case 'Medium': return '#f57c00';
      case 'Low': return '#388e3c';
      default: return '#1a237e';
    }
  };

  return (
    <div className="volunteer-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Volunteer Dashboard</h1>
            <p>Manage your donation delivery tasks efficiently</p>
          </div>
        </div>
        <div className="header-banner">
          <img src="/images/child.png" alt="Children Banner" />
        </div>
      </div>

      {/* Volunteer Profile Section */}
      <section className="dashboard-section">
        <h2 className="section-heading">Volunteer Profile</h2>
        <div className="profile-card">
          <div className="profile-left">
            <div className="profile-avatar">
              <span>👤</span>
            </div>
            <div className="profile-basic">
              <h3>{volunteerProfile.name}</h3>
              <p className="volunteer-id">ID: {volunteerProfile.volunteerId}</p>
              <p className="join-date">Member since: {volunteerProfile.joinDate}</p>
            </div>
          </div>

          <div className="profile-middle">
            <div className="profile-info-item">
              <p className="info-label">📍 Assigned Area</p>
              <p className="info-value">{volunteerProfile.assignedArea}</p>
            </div>
            <div className="profile-info-item">
              <p className="info-label">⏱️ Availability Status</p>
              <p className="info-value status-available">{volunteerProfile.availability}</p>
            </div>
          </div>

          <div className="profile-right">
            <div className="profile-badge">
              <div className="verification-badge">
                ✓ {volunteerProfile.verificationStatus}
              </div>
              <p className="badge-text">Ensures accountability and trust</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <p className="stat-number">{volunteerProfile.totalDeliveries}</p>
                <p className="stat-label">Total Deliveries</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">⭐ {volunteerProfile.rating}</p>
                <p className="stat-label">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assigned Donation Tasks */}
      <section className="dashboard-section">
        <h2 className="section-heading">Assigned Donation Tasks</h2>
        <div className="tasks-list">
          {allTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <div className="task-info-left">
                  <h3>{task.category} Donation - {task.taskId}</h3>
                  <p className="donor-info">👤 From: <strong>{task.donorName}</strong> (ID: {task.donorId})</p>
                </div>
                <div className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                  {task.priority} Priority
                </div>
              </div>

              <div className="task-content">
                <div className="location-box">
                  <h4>📍 Pickup Location</h4>
                  <p>{task.pickupLocation}</p>
                  <p className="pickup-time">⏰ {task.pickupTime}</p>
                </div>

                <div className="location-box">
                  <h4>🎯 Delivery Location</h4>
                  <p>{task.deliveryLocation}</p>
                </div>

                <div className="task-details">
                  <div className="detail-item">
                    <span className="label">Items:</span>
                    <span className="value">{task.items}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Distance:</span>
                    <span className="value">{task.distance}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Est. Time:</span>
                    <span className="value">{task.estimatedTime}</span>
                  </div>
                </div>
              </div>

              {task.isFromStorage && task.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptDonation(task.donationId)}
                    style={{ flex: 1, padding: '0.8rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}
                  >
                    ✓ Accept Delivery
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleDeclineDonation(task.donationId)}
                    style={{ flex: 1, padding: '0.8rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}
                  >
                    ✕ Decline Delivery
                  </button>
                </div>
              ) : (
                <button
                  className="view-map-btn"
                  onClick={() => {
                    setSelectedTask(task);
                    setMapVisible(true);
                  }}
                >
                  🗺️ View Route
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Task Status Management */}
      <section className="dashboard-section">
        <h2 className="section-heading">Task Status Management</h2>
        <p className="section-description">Track the progress of your assigned tasks</p>
        {allTasks.map(task => (
          <div key={task.id} className="status-management-card">
            <div className="task-title">
              <h4>{task.category} - {task.taskId}</h4>
              <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </span>
            </div>

            <div className="status-timeline">
              {getStatusSteps(task.status).map((step, index) => (
                <div key={index} className="status-flow">
                  <div className={`status-step ${step.completed ? 'completed' : ''}`}>
                    <div className="step-circle">
                      {step.completed ? '✓' : (index + 1)}
                    </div>
                    <p className="step-label">{step.step}</p>
                  </div>
                  {index < 3 && <div className={`status-connector ${step.completed ? 'completed' : ''}`}></div>}
                </div>
              ))}
            </div>

            <div className="status-actions">
              {task.status !== 'Delivered' && task.status !== 'Pending' ? (
                <>
                  <button
                    className="status-action-btn primary-action"
                    onClick={() => handleStatusUpdate(task)}
                    style={{
                      background: getNextStatus(task.status) === 'Picked Up' ? '#2196F3'
                        : getNextStatus(task.status) === 'In Transit' ? '#FF9800'
                          : '#4CAF50',
                      color: 'white', fontWeight: '600', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem',
                      width: '100%', marginBottom: '10px'
                    }}
                  >
                    {getNextStatus(task.status) === 'Picked Up' && '📦 Mark as Picked Up'}
                    {getNextStatus(task.status) === 'In Transit' && '🚚 Mark as In Transit'}
                    {getNextStatus(task.status) === 'Delivered' && '✅ Mark as Delivered'}
                  </button>

                  {(task.status === 'Picked Up' || task.status === 'In Transit') && (
                    <button
                      className="status-action-btn secondary-action"
                      onClick={() => handleUpdateLocation(task)}
                      disabled={updatingLocation}
                      style={{
                        background: '#e0f7fa', color: '#0097a7',
                        fontWeight: '600', border: '1px solid #b2ebf2', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem',
                        width: '100%'
                      }}
                    >
                      {updatingLocation ? '⏳ Updating...' : '📍 Sync Live Location to Donor'}
                    </button>
                  )}
                </>
              ) : task.status === 'Delivered' ? (
                <span style={{ color: '#4CAF50', fontWeight: '600', fontSize: '1rem' }}>✅ Delivery Complete</span>
              ) : (
                <span style={{ color: '#999', fontStyle: 'italic' }}>Accept the task first to update status</span>
              )}
            </div>
          </div>
        ))}
        <p className="transparency-note">📌 Improves transparency for donors and NGOs</p>
      </section>

      {/* Navigation & Route Assistance */}
      <section className="dashboard-section">
        <h2 className="section-heading">Navigation & Route Assistance</h2>
        <p className="section-description">Get directions and optimize your route</p>

        {mapVisible && selectedTask ? (
          <div className="route-card">
            <div className="route-header">
              <h3>{selectedTask.taskId} - Route Details</h3>
              <button
                className="close-map-btn"
                onClick={() => setMapVisible(false)}
              >
                ✕
              </button>
            </div>

            <div className="map-placeholder">
              <LeafletMap
                address={selectedTask.pickupLocation}
                label="Pickup Location"
              />
              <div className="location-text">
                <p className="map-text">📍 <strong>Pickup Location:</strong> {selectedTask.pickupLocation}</p>
                <p className="map-text">🏘️ <strong>Delivery Location:</strong> {selectedTask.deliveryLocation}</p>
              </div>
            </div>

            <div className="route-info">
              <div className="route-details-box">
                <h4>Route Optimization</h4>
                <div className="route-detail-item">
                  <span className="label">📏 Distance:</span>
                  <span className="value">{selectedTask.distance}</span>
                </div>
                <div className="route-detail-item">
                  <span className="label">⏱️ Estimated Time:</span>
                  <span className="value">{selectedTask.estimatedTime}</span>
                </div>
                <div className="route-detail-item">
                  <span className="label">🚗 Suggested Route:</span>
                  <span className="value">Shortest available path</span>
                </div>
              </div>

              <div className="route-benefits">
                <p className="benefit-title">📌 Benefits</p>
                <ul>
                  <li>Reduces delays and confusion</li>
                  <li>Optimized shortest route</li>
                  <li>Real-time navigation assistance</li>
                </ul>
              </div>
            </div>

            <div className="route-actions">
              <button className="route-action-btn primary">🚀 Start Navigation</button>
              <button className="route-action-btn secondary">📞 Contact Donor</button>
              <button className="route-action-btn secondary">🏢 Contact Delivery Point</button>
            </div>
          </div>
        ) : (
          <div className="no-route-selected">
            <p>Select "View Route" from a task above to see navigation details</p>
          </div>
        )}
      </section>

      {/* Needy People Section */}
      <section className="dashboard-section">
        <h2 className="section-heading">Needy People</h2>
        <p className="section-description">Select a needy person to assign and provide a contact number</p>

        <div className="needy-table-container">
          <table className="needy-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Area</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {needyPeople.map(person => {
                const isAssigned = assignedNeedy.some(a => a.id === person.needyId);
                return (
                  <tr
                    key={person.needyId || person._id}
                    className={`needy-row ${selectedNeedy?.needyId === person.needyId ? 'selected' : ''} ${isAssigned ? 'assigned' : ''}`}
                  >
                    <td>{person.needyId}</td>
                    <td>{person.name}</td>
                    <td>{person.area}</td>
                    <td>
                      <span className={`category-badge ${person.category.toLowerCase().replace(' ', '-')}`}>
                        {person.category}
                      </span>
                    </td>
                    <td>
                      {isAssigned ? (
                        <span className="assigned-badge">✓ Assigned</span>
                      ) : (
                        <button
                          className="select-needy-btn"
                          onClick={() => handleNeedySelect(person)}
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selectedNeedy && (
          <div className="phone-form-card">
            <h3>Assign Contact for {selectedNeedy.name}</h3>
            <p className="needy-detail">📍 Area: {selectedNeedy.area} &nbsp;|&nbsp; 📦 Category: {selectedNeedy.category}</p>

            {!showOtpInput ? (
              <form className="phone-form" onSubmit={handlePhoneSubmit}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    pattern="[0-9]{10,}"
                    required
                  />
                </div>
                <div className="phone-form-actions">
                  <button type="submit" className="submit-phone-btn">📱 Send OTP</button>
                  <button type="button" className="cancel-phone-btn" onClick={() => setSelectedNeedy(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="otp-verification-section">
                <div className="otp-sent-info">
                  <p className="otp-sent-text">✅ OTP sent to <strong>{phoneNumber}</strong></p>
                </div>
                {generatedOtp && (
                  <div className="demo-otp-display">
                    <p className="demo-otp-label">🔐 Demo OTP (for testing):</p>
                    <p className="demo-otp-code">{generatedOtp}</p>
                    <p className="demo-otp-note">⚠️ In production, this will be sent via SMS</p>
                  </div>
                )}
                <form className="otp-form" onSubmit={handleOtpVerify}>
                  <div className="form-group">
                    <label>Enter OTP</label>
                    <input
                      type="text"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      required
                      className="otp-input"
                    />
                  </div>
                  <div className="otp-actions">
                    <button type="submit" className="verify-otp-btn">✓ Verify OTP</button>
                    <button type="button" className="resend-otp-btn" onClick={handleResendOtp}>🔄 Resend OTP</button>
                    <button type="button" className="cancel-phone-btn" onClick={handleCancelOtp}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {assignedNeedy.length > 0 && (
          <div className="assigned-list">
            <h3>✅ Verified Donations</h3>
            <div className="assigned-cards">
              {assignedNeedy.map(person => (
                <div key={person.id} className="assigned-card verified">
                  <div className="verified-badge-card">✓ Verified</div>
                  <p><strong>{person.name}</strong> ({person.id})</p>
                  <p>📍 {person.area} &nbsp;|&nbsp; 📦 {person.category}</p>
                  <p>📞 {person.phone}</p>
                  <p className="verified-time">🕐 {person.verifiedAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-button">💬 Chat with Support</button>
          <button className="action-button">🔔 Notifications</button>
          <button className="action-button">📊 View Statistics</button>
          <button className="action-button">⚙️ Profile Settings</button>
        </div>
      </section>
    </div>
  );
}

export default VolunteerDashboard;
