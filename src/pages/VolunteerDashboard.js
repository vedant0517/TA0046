import React, { useState } from 'react';
import './VolunteerDashboard.css';

function VolunteerDashboard() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  // Volunteer Profile Data
  const volunteerProfile = {
    name: 'Sarah Johnson',
    volunteerId: 'VOL-2026-001',
    assignedArea: 'Hope City - North District',
    availability: 'Available',
    verificationStatus: 'Verified',
    joinDate: '2025-12-15',
    totalDeliveries: 42,
    rating: 4.8
  };

  // Assigned Tasks
  const assignedTasks = [
    {
      id: 1,
      taskId: 'TASK-001',
      donorName: 'Rajesh Kumar',
      donorId: 'D-2026-145',
      category: 'Food',
      pickupLocation: '123 Main Street, Hope City',
      deliveryLocation: 'Children Shelter - Hope City',
      priority: 'High',
      status: 'Accepted',
      pickupTime: '2026-02-21 10:00 AM',
      assignedTime: '2026-02-20 05:30 PM',
      items: '25 kg Rice Bags',
      distance: '3.2 km',
      estimatedTime: '15 mins'
    },
    {
      id: 2,
      taskId: 'TASK-002',
      donorName: 'Priya Sharma',
      donorId: 'D-2026-156',
      category: 'Clothes',
      pickupLocation: '456 Oak Avenue, Hope City',
      deliveryLocation: 'Community Center - South District',
      priority: 'Medium',
      status: 'Picked Up',
      pickupTime: '2026-02-21 02:00 PM',
      assignedTime: '2026-02-20 06:00 PM',
      items: '15 Winter Jackets',
      distance: '5.1 km',
      estimatedTime: '22 mins'
    },
    {
      id: 3,
      taskId: 'TASK-003',
      donorName: 'Ahmed Hassan',
      donorId: 'D-2026-167',
      category: 'Education',
      pickupLocation: '789 Pine Road, Hope City',
      deliveryLocation: 'Community School - North District',
      priority: 'Low',
      status: 'Pending',
      pickupTime: '2026-02-22 09:00 AM',
      assignedTime: '2026-02-20 06:15 PM',
      items: '50 Notebooks & Stationery Set',
      distance: '2.8 km',
      estimatedTime: '12 mins'
    }
  ];

  const getStatusSteps = (currentStatus) => {
    const steps = ['Accepted', 'Picked Up', 'In Transit', 'Delivered'];
    return steps.map(step => ({
      step,
      completed: steps.indexOf(step) < steps.indexOf(currentStatus) || currentStatus === step
    }));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
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
      </div>

      {/* 1️⃣ Volunteer Profile Section */}
      <section className="dashboard-section">
        <h2 className="section-heading">1️⃣ Volunteer Profile</h2>
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

      {/* 2️⃣ Assigned Donation Tasks */}
      <section className="dashboard-section">
        <h2 className="section-heading">2️⃣ Assigned Donation Tasks</h2>
        <div className="tasks-list">
          {assignedTasks.map(task => (
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

              <button 
                className="view-map-btn"
                onClick={() => {
                  setSelectedTask(task);
                  setMapVisible(true);
                }}
              >
                🗺️ View Route
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3️⃣ Task Status Management */}
      <section className="dashboard-section">
        <h2 className="section-heading">3️⃣ Task Status Management</h2>
        <p className="section-description">Track the progress of your assigned tasks</p>
        {assignedTasks.map(task => (
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
              <button className="status-action-btn">📋 Update Status</button>
              <button className="status-action-btn">💬 Contact Donor</button>
              <button className="status-action-btn">📸 Upload Proof</button>
            </div>
          </div>
        ))}
        <p className="transparency-note">📌 Improves transparency for donors and NGOs</p>
      </section>

      {/* 4️⃣ Navigation & Route Assistance */}
      <section className="dashboard-section">
        <h2 className="section-heading">4️⃣ Navigation & Route Assistance</h2>
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
              <div className="map-icon">🗺️</div>
              <p>Map would load here with route from Pickup to Delivery location</p>
              <p className="map-text">Pickup: {selectedTask.pickupLocation}</p>
              <p className="map-text">Delivery: {selectedTask.deliveryLocation}</p>
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
