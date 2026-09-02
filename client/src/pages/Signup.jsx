import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', captchaAnswer: '' });
  const [captchaData, setCaptchaData] = useState({ id: null, image: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCaptcha = async () => {
    try {
      const { data } = await api.get('/auth/security-check');
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
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        captchaId: captchaData.id,
        captchaAnswer: form.captchaAnswer
      });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setForm(prev => ({ ...prev, captchaAnswer: '' }));
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">🔧 Sangam <span>Plumbing</span></div>
          <h2>Join Sangam Plumbing Today!</h2>
          <p>Create a free account and book professional plumbing and electrical services in minutes.</p>
          <div className="auth-illustration">
            <div className="auth-service-card"><span>✅</span> Easy Online Booking</div>
            <div className="auth-service-card"><span>📊</span> Track Your Bookings</div>
            <div className="auth-service-card"><span>🔒</span> Secure & Private</div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-sub">Fill in the details to get started</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="e.g. +91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
