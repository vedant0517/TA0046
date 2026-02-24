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

    // Helper function to try geocoding with fallbacks
    const tryGeocoding = async (queryArray) => {
      if (queryArray.length === 0) {
        setCoords({ lat: 20.5937, lng: 78.9629, displayName: address });
        setError(null); // Just say it's approximate without orange warning
        setLoading(false);
        return;
      }

      const currentQuery = queryArray[0];
      try {
        const encodedAddress = encodeURIComponent(currentQuery);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
        const data = await res.json();

        if (data && data.length > 0) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name
          });
          // Only show error if we had to fall back to a less precise query
          if (queryArray.length < 3) {
            setError('Exact location not found, showing approximate area');
          } else {
            setError(null);
          }
          setLoading(false);
        } else {
          // If this query failed, try the next one in the array
          await tryGeocoding(queryArray.slice(1));
        }
      } catch (err) {
        setCoords({ lat: 20.5937, lng: 78.9629, displayName: address });
        setError('Could not connect to map service');
        setLoading(false);
      }
    };

    // Prepare fallback queries (from most specific to least specific)
    const parts = address.split(',').map(p => p.trim());
    const queries = [
      address, // Try full address first
      parts.slice(1).join(', '), // Try without the first part (e.g. "First Year Canteen")
      parts[parts.length - 1], // Try just the last part (e.g. "Maharashtra - 440019" or basically the city/state)
      'Nagpur, Maharashtra' // Ultimate fallback for this specific app context if needed, or just India
    ].filter(q => q && q.length > 0);

    tryGeocoding(queries);
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
