import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer dark-section">
      <div className="container">
        <div className="footer-top-row">
          <div className="footer-logo">🔧 Sangam<span>Plumbing</span></div>
          <div className="newsletter">
            <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px', display: 'block', color: '#ccc' }}>SUBSCRIBE FOR NEWSLETTER</span>
            <div className="news-input">
              <input type="email" placeholder="✉️ Enter your email" />
              <button className="btn-orange text-sm">SUBMIT</button>
            </div>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-links">
            <h4>SERVICES</h4>
            <ul>
              <li><Link to="/services">Pipe Repair</Link></li>
              <li><Link to="/services">Drain Cleaning</Link></li>
              <li><Link to="/services">Electrical Wiring</Link></li>
              <li><Link to="/services">Fan & Light Fitting</Link></li>
              <li><Link to="/services">Water Heater</Link></li>
              <li style={{ color: 'var(--primary)' }}>+ View All Services</li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>QUICK LINKS</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>CONTACT US</h4>
            <ul>
              <li style={{ color: '#ccc', marginBottom: '8px' }}>📍 Rasulpur, Rohtas, Banjari  IN</li>
              <li style={{ color: '#ccc', marginBottom: '8px' }}>📞 +91 8210276501</li>
              <li style={{ color: '#ccc', marginBottom: '8px' }}>✉️ sangam@gmail.com</li>
              <li style={{ color: '#ccc' }}>🕐 Mon–Sun: 8am – 5pm</li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>JOIN COMMUNITY</h4>
            <div className="socials">
              <span>📘</span> <span>🐦</span> <span>▶️</span>
            </div>

            <h4 style={{ marginTop: '30px' }}>WE ACCEPT</h4>
            <div className="payments">
              <span className="pay-icon">VISA</span>
              <span className="pay-icon">UPI</span>
              <span className="pay-icon">Cash</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Sangam Plumbing. All rights reserved.</p>
          <p>Made with ❤️ for quality home services</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
