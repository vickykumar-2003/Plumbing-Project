import { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (err) {
      console.error('Error fetching all bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      setMessage({ type: 'success', text: 'Status updated successfully!' });
      fetchBookings(); // Refresh
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setMessage({ type: 'success', text: 'Booking deleted successfully!' });
      fetchBookings(); // Refresh
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete booking.' });
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-page overflow-x-hidden">
      <div className="dashboard-header">
        <h1 className="section-title">Admin <span className="text-primary">Panel</span></h1>
        <p>Manage all customer service requests, update their status, or delete records.</p>
      </div>

      {message.text && (
        <div style={{ maxWidth: '600px', margin: '0 auto 24px' }} className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-wrapper">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No bookings found in the database.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer Info</th>
                  <th>Service Details</th>
                  <th>Booked On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <div className="customer-name">{booking.name}</div>
                      <div className="customer-phone">{booking.phone}</div>
                      <div className="customer-user">By: {booking.userId?.name || 'Guest'}</div>
                    </td>
                    <td>
                      <div className="service-name">{booking.serviceType}</div>
                      <div className="service-address">{booking.address}</div>
                      <div className="service-msg">{booking.message}</div>
                    </td>
                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className={`btn btn-sm ${booking.status === 'Pending' ? 'btn-success' : 'btn-outline'}`}
                        onClick={() => handleUpdateStatus(booking._id, booking.status)}
                      >
                        {booking.status === 'Pending' ? 'Complete' : 'Revert'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(booking._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
