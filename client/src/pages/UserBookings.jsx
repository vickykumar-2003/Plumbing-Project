import { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

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
        <h1 className="section-title">My <span className="text-primary">Bookings</span></h1>
        <p>Review all your past and upcoming service requests.</p>
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--gray-900)' }}>{booking.serviceType}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '4px' }}>{booking.address}</div>
                      {booking.message && <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '4px', fontStyle: 'italic' }}>"{booking.message}"</div>}
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>{new Date(booking.createdAt).toLocaleString()}</td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <span className={`badge badge-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserBookings;
