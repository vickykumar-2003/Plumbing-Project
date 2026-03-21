import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">🔧 Plumb<span>Ring</span></div>
            <p>Your trusted partner for professional plumbing and electrical services. Available 24/7 for all your home service needs.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Services</h4>
            <ul>
              <li><span>Pipe Repair</span></li>
              <li><span>Drain Cleaning</span></li>
              <li><span>Electrical Wiring</span></li>
              <li><span>Fan & Light Fitting</span></li>
              <li><span>Water Heater Installation</span></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Contact Us</h4>
            <ul>
              <li>📍 Rasulpur, Rohtas(Bihar)</li>
              <li>📞 +91 8210276501</li>
              <li>✉️ support@plumbring.com</li>
              <li>🕐 Mon–Sun: 8am – 8pm</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 PlumbRing. All rights reserved.</p>
          <p>Made with ❤️ for quality home services</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
