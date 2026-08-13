import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', captchaAnswer: '' });
  const [captchaData, setCaptchaData] = useState({ id: null, image: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCaptcha = async () => {
    try {
      const { data } = await api.get('/auth/captcha');
      setCaptchaData({ id: data.captchaId, image: data.image });
    } catch (e) {
      console.error("Failed to load CAPTCHA", e);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/admin-login', {
        email: form.email,
        password: form.password,
        captchaId: captchaData.id,
        captchaAnswer: form.captchaAnswer
      });
      login(data.user, data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
      setForm(prev => ({ ...prev, captchaAnswer: '' }));
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left" style={{ background: 'linear-gradient(160deg, #1a237e 0%, #283593 100%)' }}>
          <div className="auth-brand">🔧 Sangam <span>Plumbing</span></div>
          <h2>Admin Portal</h2>
          <p>Manage all service bookings, update statuses, and keep operations running smoothly.</p>
          <div className="auth-illustration">
            <div className="auth-service-card"><span>📋</span> View All Bookings</div>
            <div className="auth-service-card"><span>✅</span> Update Status</div>
            <div className="auth-service-card"><span>🗑️</span> Manage Records</div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">Admin Login</h1>
            <p className="auth-sub">Access restricted to administrators only</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="adminEmail">Admin Email</label>
                <input
                  id="adminEmail"
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="admin@plumbring.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="adminPassword">Password</label>
                <input
                  id="adminPassword"
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Admin password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="captchaAnswer">Security Check</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  {captchaData.image ? (
                    <img src={captchaData.image} alt="CAPTCHA Challenge" style={{ border: '1px solid #ccc', borderRadius: '4px', maxWidth: '100%', height: '50px' }} />
                  ) : (
                    <div style={{ height: '50px', width: '160px', background: '#f1f1f1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#666' }}>Loading...</div>
                  )}
                  <button type="button" onClick={fetchCaptcha} style={{ background: 'none', border: '1px solid #ddd', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }} aria-label="Refresh CAPTCHA" title="Refresh CAPTCHA">
                    ↻
                  </button>
                </div>
                <input
                  id="captchaAnswer"
                  type="text"
                  name="captchaAnswer"
                  className="form-control"
                  placeholder="Enter characters above"
                  value={form.captchaAnswer}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#1a237e' }} disabled={loading}>
                {loading ? 'Signing in...' : 'Admin Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Not an admin? <Link to="/login">User Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
