import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import ServiceCard from '../components/ServiceCard';
import './Home.css';
import project1 from '../assets/project1.png';
import project2 from '../assets/project2.png';
import ownerPhoto from '../assets/sangam.png';

const Home = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', serviceType: 'Plumbing Repair' });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data.slice(0, 3)));
  }, []);

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <main className="plumbo-home">
      {/* Top Banner (Optional for Nav matching) */}
      <div className="top-banner">
        <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
          <span>🕒 OPEN 8AM - 5PM (MON - SUN)</span>
          <span>📍 RASULPUR, ROHTAS, BANJARI IN</span>
          <span className="emergency-contact">📞 24x7 EMERGENCY: +91 8210276501</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="plumbo-hero" style={{ backgroundImage: `url(${project1})` }}>
        <div className="hero-overlay"></div>
        <div className="container hero-grid">
          <div className="hero-left">
            <span className="tiny-line"></span>
            <span className="tag">FAST & RELIABLE</span>
            <h1>Sangam Plumbing & Electrical Services</h1>
            <ul>
              <li><span className="hero-check">◎</span> Certified Plumbers & Electricians</li>
              <li><span className="hero-check">◎</span> Fast Fixes, Transparent Pricing</li>
            </ul>
            <div className="hero-buttons">
              <Link to="/about"><button className="btn-light">MEET THE OWNER ➔</button></Link>
              <Link to="/services"><button className="btn-transparent">VIEW SERVICES ➔</button></Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="request-card">
              <h3>Request Service Today</h3>
              <p>If you need to speak to us about a general query fill in the form below...</p>
              <form onSubmit={handleHeroSubmit}>
                <div className="form-row">
                  <div className="input-group">
                    <label>NAME HERE</label>
                    <input type="text" placeholder="Enter your name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>PHONE HERE</label>
                    <input type="tel" placeholder="Enter your phone number" required onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>EMAIL HERE</label>
                    <input type="email" placeholder="Enter email address" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>SELECT SERVICE</label>
                    <select onChange={e => setFormData({ ...formData, serviceType: e.target.value })}>
                      <option>Plumbing Repair</option>
                      <option>Pipe Setup</option>
                      <option>Electrical Wiring</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-submit">SUBMIT</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* BEST PLUMBING SERVICES */}
      <section className="section plumbo-services">
        <div className="container">
          <div className="section-head text-center">
            <span className="tiny-line"></span>
            <span className="tag">LOOK TO THE</span>
            <h2>Our Featured Services</h2>
          </div>

          <div className="grid-3" style={{ marginTop: '40px' }}>
            {services.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>

          <div className="slider-nav">
            <span className="slider-line"></span>
            <Link to="/services" style={{ color: '#111', textDecoration: 'none' }}>VIEW ALL SERVICES ➔</Link>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="section dark-section">
        <div className="container">
          <div className="section-head text-center white-text">
            <span className="tiny-line"></span>
            <span className="tag">HOW WE WORK</span>
            <h2>Best Plumbing Services</h2>
          </div>

          <div className="how-cards">
            {['Schedule a Free Inspection', 'Get a Customized Quote', 'Professional Execution', 'Final Walkthrough & Warranty'].map((title, i) => (
              <div className="w-card" key={i}>
                <div className="icon-org">🛠</div>
                <h4>{title}</h4>
                <p>Reach out to us to book a free inspection or quotation, and we'll ensure your satisfaction.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS RATIO */}
      <section className="section success-section">
        <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <span className="tag">SUCCESS RATIO</span>
            <h2 className="big-h2">We have been providing secure & trusted plumbing services since 2006. Our goal is to deliver the best experience for all your plumbing needs.</h2>
            <div className="stats-row">
              <div>
                <h2>5k+</h2>
                <h5>TOTAL SERVICED</h5>
                <p>We take pride in the number of customers we've successfully served over the years.</p>
              </div>
              <div>
                <h2>3k+</h2>
                <h5>HAPPY CLIENTS</h5>
                <p>Our clients come first, and we work tirelessly to exceed their expectations.</p>
              </div>
              <div>
                <h2>2k+</h2>
                <h5>HAPPY REVIEWS</h5>
                <p>Happy reviews reflect our clients' satisfaction and inspire us to keep delivering excellence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials">
        <div className="container">
          <div className="test-head flex-between">
            <div>
              <span className="tag">TESTIMONIALS</span>
              <h2>Why People Love Us</h2>
            </div>
            <div className="google-rating">
              <span className="g-logo">G</span> Google Rating <b>4.8</b> <span className="stars">★★★★★</span>
            </div>
          </div>

          <div className="test-cards">
            {[
              { name: 'JEROME BELL', role: 'Homeowner', head: 'Quick and Reliable Service', txt: 'I recently had an emergency plumbing issue, and this plumber provided quick and reliable service.' },
              { name: 'KATHRYN MURPHY', role: 'CEO, Logistics', head: 'Best In Town Man', txt: 'They arrived promptly, identified the issue, and resolved it efficiently. I highly recommend.' },
              { name: 'MARK JOHNSON', role: 'Homeowner', head: 'Professional Work', txt: 'This plumber provided quick and reliable service. They arrived promptly, identified the issue.' }
            ].map((review, i) => (
              <div className="t-card" key={i}>
                <div className="user-line">
                  <div className="u-avatar"></div>
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.role}</span>
                  </div>
                </div>
                <h4>"{review.head}"</h4>
                <p>{review.txt}</p>
                <span className="stars" style={{ color: '#fa5515' }}>★★★★★</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY BANNER */}
      <section className="emergency-banner" style={{ backgroundImage: `url(${project2})` }}>
        <div className="container">
          <div className="eb-card">
            <span className="tag">EMERGENCY SERVICE</span>
            <h2>Our team of expert plumbers is available 24/7 for emergency services.</h2>
            <p>We know that plumbing problems can be stressful and inconvenient, so we offer quick and reliable emergency services.</p>
            <div className="eb-actions">
              <Link to="/contact"><button className="btn-orange">BOOK APPOINTMENT ➔</button></Link>
              <div className="eb-contact">
                <span>24x7 EMERGENCY SERVICES</span>
                <strong>+91 8210276501</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION / FOOTER */}
      <section className="location-section">
        <div className="container" style={{ display: 'flex', gap: '50px', padding: '60px 0' }}>
          <div style={{ flex: 1 }}>
            <span className="tag">LOCATION</span>
            <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Find Us</h2>
            <p>Visit us at our conveniently located office, easily accessible from all major routes.</p>
            <div className="addr-box">
              <strong>Address</strong>
              <p>Rasulpur, Rohtas, Banjari IN</p>
            </div>
            <div className="addr-box">
              <strong>Opening Hours</strong>
              <p>OPEN : 8AM - 5PM (MON - SUN)</p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            {/* Real Google Map Embed */}
            <div className="map-placeholder" style={{ padding: 0, overflow: 'hidden' }}>
              <iframe
                title="Google Map location of Sangam Plumbing"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115132.86377755581!2d83.9181165!3d24.6677765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398c8cde1e4b8ef9%3A0x633513a96864de06!2sBanjari%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
