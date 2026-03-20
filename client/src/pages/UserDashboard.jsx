import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    serviceType: '',
    address: '',
    message: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, servicesRes] = await Promise.all([
        api.get('/bookings/my'),
        api.get('/services')
      ]);
      setBookings(bookingsRes.data);
      // Fallback if services API is empty
      if (servicesRes.data && servicesRes.data.length > 0) {
        setServices(servicesRes.data);
      } else {
        setServices([
          { id: 1, title: 'Pipe Leak Repair', category: 'Plumbing' },
          { id: 2, title: 'Wiring & Panels', category: 'Electrical' },
          { id: 3, title: 'Drain Cleaning', category: 'Plumbing' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);
    try {
      await api.post('/bookings', form);
      setMessage({ type: 'success', text: 'Booking request sent successfully!' });
      setForm({ ...form, serviceType: '', message: '' }); 
      fetchData(); 
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit booking.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;

  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;

  return (
    <div className="dashboard-page overflow-x-hidden">
      <div className="dashboard-header">
        <h1 className="section-title">Welcome, <span className="text-primary">{user?.name}</span></h1>
        <p>Book a new service, track your existing requests, or view your history.</p>
      </div>

      {/* Stats Area */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '2.5rem', background: 'var(--primary-light)', color: 'var(--primary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            📅
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>{bookings.length}</div>
            <div style={{ color: 'var(--gray-600)', fontWeight: 600 }}>Total Bookings</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '2.5rem', background: '#fff3cd', color: '#856404', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ⏳
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>{pendingBookings}</div>
            <div style={{ color: 'var(--gray-600)', fontWeight: 600 }}>Pending</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '2.5rem', background: '#d1f2eb', color: '#0e6251', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✅
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>{completedBookings}</div>
            <div style={{ color: 'var(--gray-600)', fontWeight: 600 }}>Completed</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Left: Booking Form */}
        <div className="dashboard-form-card card">
          <div className="card-body">
            <h2 className="card-title">Book a New Service</h2>
            <p className="card-subtitle">Tell us what you need and we'll be there.</p>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="name">Contact Name</label>
                  <input type="text" id="name" name="name" className="form-control" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required />
                </div>
              </div>
              
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="serviceType">Service Type</label>
                  <select id="serviceType" name="serviceType" className="form-control" value={form.serviceType} onChange={handleChange} required>
                    <option value="">Select a service</option>
                    {services.map(s => <option key={s.id || s._id} value={s.title}>{s.title} ({s.category})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Service Address</label>
                  <input type="text" id="address" name="address" className="form-control" placeholder="Street, Area, City" value={form.address} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea id="message" name="message" className="form-control" placeholder="Any specific details..." value={form.message} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="dashboard-list-card card" style={{ padding: '32px' }}>
          <h2 className="card-title">Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/dashboard/bookings" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <span className="icon">🕒</span> View All Bookings
            </Link>
            <Link to="/services" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <span className="icon">🔍</span> Browse Services
            </Link>
            <Link to="/dashboard/profile" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <span className="icon">👤</span> Manage Profile
            </Link>
          </div>

          <div style={{ marginTop: '40px', padding: '24px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>Need Emergency Help?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', marginBottom: '16px' }}>Call us directly for 24/7 service.</p>
            <a href="tel:+919876543210" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Call +91 98765 43210</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
