import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', captchaAnswer: '' });
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
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
        captchaId: captchaData.id,
        captchaAnswer: form.captchaAnswer
      });
      login(data.user, data.token);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'technician') {
        navigate('/technician/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <h2>Welcome Back!</h2>
          <p>Sign in to manage your bookings and track your service status.</p>
          <div className="auth-illustration">
            <div className="auth-service-card"><span>🔧</span> Plumbing Services</div>
            <div className="auth-service-card"><span>⚡</span> Electrical Services</div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">User Login</h1>
            <p className="auth-sub">Enter your credentials to continue</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
              <p style={{ marginTop: 8 }}><Link to="/admin-login">Admin Login →</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
