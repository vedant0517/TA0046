import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function LeafletMap({ address, label }) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    setError(null);

    // Use Nominatim (OpenStreetMap) geocoding API
    const encodedAddress = encodeURIComponent(address);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name
          });
        } else {
          // Default to a general location if geocoding fails
          setCoords({ lat: 20.5937, lng: 78.9629, displayName: address });
          setError('Exact location not found, showing approximate area');
        }
        setLoading(false);
      })
      .catch(() => {
        setCoords({ lat: 20.5937, lng: 78.9629, displayName: address });
        setError('Could not geocode address');
        setLoading(false);
      });
  }, [address]);

  if (loading) {
    return (
      <div style={{
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '1.1rem',
        color: '#1a237e'
      }}>
        🗺️ Loading map...
      </div>
    );
  }

  if (!coords) {
    return (
      <div style={{
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff3e0',
        borderRadius: '8px',
        fontSize: '1rem',
        color: '#e65100'
      }}>
        ⚠️ Unable to load map for this address
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p style={{ color: '#f57c00', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          ⚠️ {error}
        </p>
      )}
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={15}
        style={{ height: '350px', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>
            <strong>{label || 'Pickup Location'}</strong><br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
