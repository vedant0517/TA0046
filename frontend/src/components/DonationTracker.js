import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DonationTracker.css';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different locations
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const currentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to auto-fit map bounds to show all markers
function MapBoundsHandler({ positions }) {
  const map = useMap();
  
  useEffect(() => {
    if (positions && positions.length > 0) {
      const validPositions = positions.filter(pos => pos && pos.length === 2);
      if (validPositions.length > 0) {
        const bounds = L.latLngBounds(validPositions);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [positions, map]);
  
  return null;
}

function DonationTracker({ donation }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedHistory, setExpandedHistory] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, []);

  const getTimeSince = (timestamp) => {
    const diff = currentTime - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ffc107';
      case 'Accepted by Volunteer': return '#2196f3';
      case 'Picked Up': return '#00bcd4';
      case 'In Transit': return '#ff9800';
      case 'Delivered': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Accepted by Volunteer': return '✅';
      case 'Picked Up': return '📦';
      case 'In Transit': return '🚚';
      case 'Delivered': return '🎉';
      default: return '📌';
    }
  };

  if (!donation.tracking) {
    return <div className="no-tracking">No tracking information available</div>;
  }

  const { tracking, status, assignedVolunteer, volunteerPhone, volunteerVehicle } = donation;
  const isActive = ['Picked Up', 'In Transit'].includes(status);

  // E-commerce style progress steps
  const progressSteps = [
    { 
      key: 'created', 
      label: 'Donation Created', 
      icon: '📝',
      status: 'Pending',
      completed: true,
      timestamp: donation.createdDate
    },
    { 
      key: 'accepted', 
      label: 'Volunteer Assigned', 
      icon: '✅',
      status: 'Accepted by Volunteer',
      completed: ['Accepted by Volunteer', 'Picked Up', 'In Transit', 'Delivered'].includes(status),
      timestamp: assignedVolunteer ? tracking.locationHistory?.find(h => h.status === 'Accepted by Volunteer')?.timestamp : null
    },
    { 
      key: 'pickedUp', 
      label: 'Picked Up', 
      icon: '📦',
      status: 'Picked Up',
      completed: ['Picked Up', 'In Transit', 'Delivered'].includes(status),
      timestamp: tracking.locationHistory?.find(h => h.status === 'Picked Up')?.timestamp
    },
    { 
      key: 'inTransit', 
      label: 'In Transit', 
      icon: '🚚',
      status: 'In Transit',
      completed: ['In Transit', 'Delivered'].includes(status),
      timestamp: tracking.locationHistory?.find(h => h.status === 'In Transit')?.timestamp
    },
    { 
      key: 'delivered', 
      label: 'Delivered', 
      icon: '🎉',
      status: 'Delivered',
      completed: status === 'Delivered',
      timestamp: status === 'Delivered' ? tracking.locationHistory?.find(h => h.status === 'Delivered')?.timestamp : null
    }
  ];

  const currentStepIndex = progressSteps.findIndex(step => step.status === status);

  return (
    <div className="donation-tracker">
      {/* E-commerce Style Progress Tracker */}
      <div className="progress-tracker-container">
        <h4 className="progress-title">Donation Journey</h4>
        <div className="progress-steps">
          {progressSteps.map((step, index) => {
            const isCurrentStep = step.status === status;
            const isCompleted = step.completed;
            const isFuture = !isCompleted && !isCurrentStep;
            
            return (
              <div key={step.key} className={`progress-step ${isCompleted ? 'completed' : ''} ${isCurrentStep ? 'current' : ''} ${isFuture ? 'future' : ''}`}>
                <div className="step-indicator">
                  <div className="step-icon-wrapper">
                    <span className="step-icon">{step.icon}</span>
                    {isCompleted && <span className="checkmark">✓</span>}
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className={`step-line ${progressSteps[index + 1].completed || progressSteps[index + 1].status === status ? 'active' : ''}`}></div>
                  )}
                </div>
                <div className="step-content">
                  <p className="step-label">{step.label}</p>
                  {step.timestamp && (
                    <p className="step-time">{new Date(step.timestamp).toLocaleString()}</p>
                  )}
                  {isCurrentStep && !isCompleted && (
                    <p className="step-status-badge">Current</p>
                  )}
                  {isFuture && (
                    <p className="step-status-badge future-badge">Pending</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Header */}
      <div className="tracker-header" style={{ borderLeftColor: getStatusColor(status) }}>
        <div className="tracker-header-left">
          <span className="status-icon">{getStatusIcon(status)}</span>
          <div>
            <h4 className="tracker-title">{status}</h4>
            <p className="tracker-subtitle">
              {tracking.lastUpdate && `Updated ${getTimeSince(tracking.lastUpdate)}`}
            </p>
          </div>
        </div>
        <div className="tracker-header-right">
          <span className="donation-id-badge">{donation.donationId}</span>
        </div>
      </div>

      {/* Live Tracking Section */}
      {isActive && (
        <div className="live-tracking-section">
          <div className="live-indicator">
            <span className="pulse-dot"></span>
            <span className="live-text">LIVE TRACKING</span>
          </div>
          
          <div className="current-location-card">
            <div className="location-icon-wrapper">
              <div className="location-pin">📍</div>
            </div>
            <div className="location-details">
              <h5>Current Location</h5>
              <p className="location-address">{tracking.currentLocation}</p>
              {tracking.coordinates && tracking.coordinates.lat && tracking.coordinates.lng && (
                <p className="coordinates">
                  📊 GPS: {tracking.coordinates.lat.toFixed(6)}°, {tracking.coordinates.lng.toFixed(6)}°
                  <span className="precision-badge">High Precision</span>
                </p>
              )}
              <p className="last-update">
                🕐 Last updated: {new Date(tracking.lastUpdate).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="delivery-info-grid">
            {tracking.distanceCovered && (
              <div className="info-box">
                <div className="info-icon">🛣️</div>
                <div>
                  <p className="info-label">Distance Covered</p>
                  <p className="info-value">{tracking.distanceCovered}</p>
                </div>
              </div>
            )}
            
            {tracking.estimatedDelivery && (
              <div className="info-box">
                <div className="info-icon">⏱️</div>
                <div>
                  <p className="info-label">Estimated Delivery</p>
                  <p className="info-value">{tracking.estimatedDelivery}</p>
                </div>
              </div>
            )}

            {tracking.destinationAddress && (
              <div className="info-box full-width">
                <div className="info-icon">🎯</div>
                <div>
                  <p className="info-label">Destination</p>
                  <p className="info-value">{tracking.destinationAddress}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Volunteer Information */}
      {assignedVolunteer && (
        <div className="volunteer-info-card">
          <h5>👤 Volunteer Information</h5>
          <div className="volunteer-details-grid">
            <div className="volunteer-detail">
              <span className="detail-icon">👨‍💼</span>
              <div>
                <p className="detail-label">Name</p>
                <p className="detail-value">{assignedVolunteer}</p>
              </div>
            </div>
            
            {volunteerPhone && (
              <div className="volunteer-detail">
                <span className="detail-icon">📱</span>
                <div>
                  <p className="detail-label">Phone</p>
                  <p className="detail-value">{volunteerPhone}</p>
                </div>
              </div>
            )}
            
            {volunteerVehicle && (
              <div className="volunteer-detail">
                <span className="detail-icon">🚗</span>
                <div>
                  <p className="detail-label">Vehicle</p>
                  <p className="detail-value">{volunteerVehicle}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Book Donation Details - shown for book/education donations */}
      {donation.bookDetails && (
        <div className="book-details-card">
          <h5>📚 Book Donation Details</h5>
          <div className="book-details-grid">
            {donation.bookDetails.titles && (
              <div className="book-detail full-width">
                <span className="detail-icon">📖</span>
                <div>
                  <p className="detail-label">Book Titles</p>
                  <p className="detail-value">{donation.bookDetails.titles}</p>
                </div>
              </div>
            )}
            
            {donation.bookDetails.subject && (
              <div className="book-detail">
                <span className="detail-icon">🎓</span>
                <div>
                  <p className="detail-label">Subject</p>
                  <p className="detail-value">{donation.bookDetails.subject}</p>
                </div>
              </div>
            )}
            
            {donation.bookDetails.gradeLevel && (
              <div className="book-detail">
                <span className="detail-icon">📊</span>
                <div>
                  <p className="detail-label">Grade Level</p>
                  <p className="detail-value">{donation.bookDetails.gradeLevel}</p>
                </div>
              </div>
            )}
            
            {donation.bookDetails.condition && (
              <div className="book-detail">
                <span className="detail-icon">⭐</span>
                <div>
                  <p className="detail-label">Condition</p>
                  <p className="detail-value">{donation.bookDetails.condition}</p>
                </div>
              </div>
            )}
            
            {donation.bookDetails.language && (
              <div className="book-detail">
                <span className="detail-icon">🌐</span>
                <div>
                  <p className="detail-label">Language</p>
                  <p className="detail-value">{donation.bookDetails.language}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Matching schools indicator */}
          <div className="matching-schools-notice">
            <span className="matching-icon">🎯</span>
            <span className="matching-text">
              This donation can help schools in need of {donation.bookDetails.subject || 'educational'} materials!
            </span>
          </div>
        </div>
      )}

      {/* Location History Timeline */}
      <div className="location-history-section">
        <div className="history-header" onClick={() => setExpandedHistory(!expandedHistory)}>
          <h5>📍 Location History ({tracking.locationHistory?.length || 0} updates)</h5>
          <button className="expand-btn">
            {expandedHistory ? '▲' : '▼'}
          </button>
        </div>

        {expandedHistory && tracking.locationHistory && (
          <div className="timeline">
            {[...tracking.locationHistory].reverse().map((location, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                  {index < tracking.locationHistory.length - 1 && (
                    <div className="timeline-line"></div>
                  )}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-status">{location.status}</span>
                    <span className="timeline-time">
                      {new Date(location.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="timeline-location">{location.location}</p>
                  {location.coordinates && location.coordinates.lat && location.coordinates.lng && (
                    <p className="timeline-coords">
                      🛰️ GPS: {location.coordinates.lat.toFixed(6)}°, {location.coordinates.lng.toFixed(6)}°
                    </p>
                  )}
                  {location.note && (
                    <p className="timeline-note">💬 {location.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Leaflet Map - Always show map with available location data */}
      {(() => {
        // Extract coordinates from location history
        const pickupLocation = tracking.locationHistory?.[0];
        
        // Pickup coordinates - prioritize actual coordinates from donation
        let pickupCoords;
        if (pickupLocation?.coordinates && pickupLocation.coordinates.lat && pickupLocation.coordinates.lng) {
          // Use coordinates from location history
          pickupCoords = [pickupLocation.coordinates.lat, pickupLocation.coordinates.lng];
        } else if (tracking.coordinates && tracking.coordinates.lat && tracking.coordinates.lng) {
          // Use coordinates from tracking object (initial pickup)
          pickupCoords = [tracking.coordinates.lat, tracking.coordinates.lng];
        } else {
          // Default to Bangalore center only if no coordinates available
          pickupCoords = [12.9716, 77.5946];
          console.warn('⚠️ No coordinates available, using default location');
        }
        
        // Current location (use volunteer position if active and different from pickup)
        const currentLocation = (isActive && tracking.coordinates && 
                                tracking.coordinates.lat && tracking.coordinates.lng &&
                                (tracking.coordinates.lat !== pickupCoords[0] || 
                                 tracking.coordinates.lng !== pickupCoords[1]))
          ? [tracking.coordinates.lat, tracking.coordinates.lng]
          : pickupCoords;
        
        // Destination coordinates (estimate based on direction or use offset from current)
        const destinationCoords = isActive ? [
          currentLocation[0] + 0.05,
          currentLocation[1] + 0.05
        ] : pickupCoords;
        
        // All positions for map bounds
        const allPositions = [pickupCoords, currentLocation, destinationCoords];
        
        // Route path
        const routePath = tracking.locationHistory
          ?.filter(loc => loc.coordinates && loc.coordinates.lat && loc.coordinates.lng)
          .map(loc => [loc.coordinates.lat, loc.coordinates.lng]) || [pickupCoords, currentLocation];
        
        // Check if we have real coordinates
        const hasRealCoordinates = (pickupLocation?.coordinates && pickupLocation.coordinates.lat) || 
                                   (tracking.coordinates && tracking.coordinates.lat);
        const mapZoom = hasRealCoordinates ? 15 : 12;
        
        return (
          <div className="map-container">
            <div className="map-header">
              <h5>🗺️ {isActive ? 'Live Location Map' : 'Pickup Location Map'}</h5>
              <p className="map-description">
                {isActive ? 'Real-time tracking of your donation journey' : 'Your donation pickup location'}
              </p>
              {!hasRealCoordinates ? (
                <div className="map-notice warning">
                  ⚠️ Showing approximate location. For precise GPS tracking, use "Use Current Location" when creating donations.
                </div>
              ) : (
                <div className="map-notice success">
                  ✅ Using precise GPS coordinates (Lat: {pickupCoords[0].toFixed(4)}°, Lng: {pickupCoords[1].toFixed(4)}°)
                </div>
              )}
            </div>
            <div className="leaflet-map-wrapper">
              <MapContainer
                center={isActive ? currentLocation : pickupCoords}
                zoom={mapZoom}
                style={{ height: '400px', width: '100%', borderRadius: '12px' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Pickup Location Marker (Green) */}
                <Marker position={pickupCoords} icon={pickupIcon}>
                  <Popup>
                    <div className="map-popup">
                      <strong>🏠 Pickup Location</strong><br/>
                      {pickupLocation?.location || donation.pickupLocation}<br/>
                      <small>{pickupLocation?.timestamp ? new Date(pickupLocation.timestamp).toLocaleString() : ''}</small>
                    </div>
                  </Popup>
                </Marker>
                
                {/* Current Volunteer Location Marker (Blue) - Only show when active */}
                {isActive && (
                  <Marker position={currentLocation} icon={currentIcon}>
                    <Popup>
                      <div className="map-popup">
                        <strong>🚚 Current Location</strong><br/>
                        {tracking.currentLocation}<br/>
                        <small>Updated: {new Date(tracking.lastUpdate).toLocaleTimeString()}</small><br/>
                        {assignedVolunteer && (
                          <>
                            <strong>Volunteer:</strong> {assignedVolunteer}<br/>
                            {volunteerPhone && (
                              <><strong>Phone:</strong> {volunteerPhone}</>
                            )}
                          </>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* Destination Marker (Red) */}
                {tracking.destinationAddress && (
                  <Marker position={destinationCoords} icon={destinationIcon}>
                    <Popup>
                      <div className="map-popup">
                        <strong>🎯 Destination</strong><br/>
                        {tracking.destinationAddress}<br/>
                        {tracking.estimatedDelivery && (
                          <small>ETA: {tracking.estimatedDelivery}</small>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* Route Path */}
                {routePath.length > 1 && (
                  <Polyline
                    positions={routePath}
                    color="#2196f3"
                    weight={4}
                    opacity={0.7}
                    dashArray="10, 10"
                  />
                )}
                
                {/* Auto-fit bounds to show all markers */}
                <MapBoundsHandler positions={allPositions} />
              </MapContainer>
            </div>
            
            {/* Map Legend */}
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-marker green">🟢</span>
                <span>Pickup Location</span>
              </div>
              {isActive && (
                <>
                  <div className="legend-item">
                    <span className="legend-marker blue">🔵</span>
                    <span>Current Location (Volunteer)</span>
                  </div>
                  {tracking.destinationAddress && (
                    <div className="legend-item">
                      <span className="legend-marker red">🔴</span>
                      <span>Destination</span>
                    </div>
                  )}
                  {routePath.length > 1 && (
                    <div className="legend-item">
                      <span className="legend-line">━━</span>
                      <span>Route Traveled</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* Status Message */}
      {status === 'Pending' && (
        <div className="status-message pending">
          ⏳ Your donation is waiting to be accepted by a volunteer...
        </div>
      )}
      
      {status === 'Delivered' && (
        <div className="status-message success">
          🎉 Donation successfully delivered! Thank you for making a difference!
        </div>
      )}
    </div>
  );
}

export default DonationTracker;
