import { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, techRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/technicians')
      ]);
      setBookings(bookRes.data);
      setTechnicians(techRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (err) {
      console.error('Error fetching all bookings:', err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      setMessage({ type: 'success', text: `Status updated to ${newStatus}` });
      fetchBookings(); // Refresh
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  const handleAssignTech = async (id, techId) => {
    try {
      await api.put(`/bookings/${id}`, { technicianId: techId });
      setMessage({ type: 'success', text: 'Technician assigned successfully.' });
      fetchBookings(); // Refresh
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to assign technician.' });
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
                      <div className="customer-user" style={{ fontSize: '11px', color: '#888' }}>
                        Account: {booking.userId?.name || 'Guest'}
                      </div>
                      {booking.technicianId && (
                        <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '4px', fontWeight: 600 }}>
                          🔧 Tech: {booking.technicianId?.name}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="service-name">{booking.serviceType}</div>
                      <div className="service-address">{booking.address}</div>
                      <div className="service-msg">{booking.message}</div>
                    </td>
                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                        className={`badge badge-${booking.status.replace(/\s+/g, '-').toLowerCase()}`}
                        style={{ outline: "none", cursor: 'pointer', padding: '4px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px', display: 'block' }}
                      >
                        {['Pending', 'Confirmed', 'Assigned', 'Accepted', 'On The Way', 'Arrived', 'Work In Progress', 'Completed', 'Cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>

                      <select
                        value={booking.technicianId?._id || ''}
                        onChange={(e) => handleAssignTech(booking._id, e.target.value)}
                        style={{ fontSize: '11px', outline: 'none', padding: '2px', border: '1px solid #ddd', borderRadius: '3px' }}
                      >
                        <option value="">Unassigned</option>
                        {technicians.map(tech => (
                          <option key={tech._id} value={tech._id}>{tech.name} (Tech)</option>
                        ))}
                      </select>
                    </td>
                    <td className="actions-cell">
                      {booking.status === 'Pending' && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                        >
                          Confirm
                        </button>
                      )}
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
