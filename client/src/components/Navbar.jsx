import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide Navbar on dashboard and admin routes
  if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">🔧</span>
          <span className="brand-text">Sangam <span className="brand-accent">Plumbing</span></span>
        </Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        {/* Nav Links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
          <li><Link to="/vlog" onClick={closeMenu}>Vlog</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <li><Link to="/admin/dashboard" className="nav-btn" onClick={closeMenu}>Dashboard</Link></li>
              ) : (
                <li><Link to="/dashboard" className="nav-btn" onClick={closeMenu}>My Bookings</Link></li>
              )}
              <li>
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/signup" className="nav-btn" onClick={closeMenu}>Get Started</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
