import { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';
import LiveTrackingMap from '../components/LiveTrackingMap';

// Haversine formula for distance (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

const UserBookings = () => {
  const { socket, socketStatus, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [techLocations, setTechLocations] = useState({});
  const [customerLocation, setCustomerLocation] = useState(null);

  useEffect(() => {
    fetchBookings();

    // Get customer's location once for distance calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCustomerLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Customer location denied temporarily.', err)
      );
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('technician:location:update', (data) => {
        setTechLocations(prev => ({
          ...prev,
          [data.technicianId]: {
            lat: data.lat,       // server sends 'lat'
            lng: data.lng,       // server sends 'lng'
            updatedAt: data.updatedAt
          }
        }));
      });

      // Auto-refresh bookings when status changes
      socket.on('booking-update', () => {
        fetchBookings();
      });
    }
    return () => {
      if (socket) {
        socket.off('technician:location:update');
        socket.off('booking-update');
      }
    };
  }, [socket]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-page overflow-x-hidden">
      <div className="dashboard-header">
        <h1 className="section-title">My <span className="text-primary">Bookings</span> & Tracking</h1>
        <p>Review your booking history and track active technicians in real-time.</p>
      </div>

      <div className="dashboard-list-card" style={{ width: '100%', maxWidth: '1000px' }}>
        <h2 className="card-title">Booking History</h2>
        {bookings.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📝</div>
            <p>You haven't booked any services yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Service Details</th>
                  <th>Booking Date</th>
                  <th>Status & Tracking</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => {
                  // Check if this booking has an active tracking tech
                  const techId = booking.technicianId?._id || booking.technicianId;
                  const techLoc = techId ? techLocations[techId] : null;
                  const isTrackingActive = ['CONFIRMED', 'ASSIGNED', 'ON THE WAY', 'WORK IN PROGRESS'].includes(booking.status.toUpperCase()) || techLoc !== null;

                  let distance = null;
                  if (techLoc && customerLocation) {
                    distance = calculateDistance(customerLocation.lat, customerLocation.lng, techLoc.lat, techLoc.lng);
                  }

                  return (
                    <tr key={booking._id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--gray-900)' }}>{booking.serviceType}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '4px' }}>{booking.address}</div>
                        {booking.message && <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '4px', fontStyle: 'italic' }}>"{booking.message}"</div>}
                      </td>
                      <td style={{ verticalAlign: 'top' }}>{new Date(booking.createdAt).toLocaleString()}</td>
                      <td style={{ verticalAlign: 'top' }}>
                        <span className={`badge badge-${booking.status.replace(/\s+/g, '-').toLowerCase()}`}>
                          {booking.status}
                        </span>

                        {isTrackingActive && (
                          <div style={{ marginTop: '15px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            {/* LIVE HEADER */}
                            {techLoc ? (
                              <div style={{ background: '#28872b', color: 'white', padding: '12px 15px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                                🚚 Technician On The Way <br />
                                <span style={{ fontSize: '12px' }}>ETA: Calculating...</span>
                              </div>
                            ) : (
                              <div style={{ background: '#f5f7fa', color: '#333', padding: '12px 15px', textAlign: 'center', fontWeight: '600', fontSize: '15px', borderBottom: '1px solid #e0e0e0' }}>
                                🕒 Waiting for Technician Location...
                              </div>
                            )}
                            {techLoc && (
                              <div style={{ padding: '15px', background: '#fafafa', borderBottom: '1px solid #eee' }}>
                                <p style={{ margin: '0 0 5px' }}><strong>Technician:</strong> {booking.technicianId?.name || 'Assigned Technician'}</p>
                                <p style={{ margin: '0 0 5px' }}>
                                  <strong>Status:</strong> {socketStatus === 'Connected' ? '🟢 LIVE (Connected)' : `🔴 ${socketStatus}`}
                                </p>
                                {distance && <p style={{ margin: '0 0 5px' }}><strong>Distance:</strong> {distance} km away</p>}
                                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}><strong>Last Updated:</strong> {new Date(techLoc.updatedAt).toLocaleTimeString()}</p>
                              </div>
                            )}

                            <div style={{ position: 'relative' }}>
                              <LiveTrackingMap techLoc={techLoc} customerLoc={customerLocation} />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserBookings;
