import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ServiceCard from '../components/ServiceCard';
import ownerPhoto from '../assets/sangam.png';
import project1 from '../assets/project1.png';
import project2 from '../assets/project2.png';
import './Home.css';

const Home = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data.slice(0, 6)));
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-tag">⚡ Professional Home Services</span>
            <h1 className="hero-title">
              Expert <span>Plumbing</span> &amp;<br />
              <span>Electrical</span> Services
            </h1>
            <p className="hero-subtitle">
              Fast, reliable, and certified technicians at your doorstep.
              Book a service in minutes and get the job done right.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">Book a Service</Link>
              <Link to="/services" className="btn btn-outline btn-lg">View Services</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>100+</strong><span>Happy Customers</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>20+</strong><span>Expert Technicians</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>4.9★</strong><span>Average Rating</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-icon">🔧</div>
              <div>
                <p className="hero-card-title">Plumbing Services</p>
                <p className="hero-card-sub">Pipes · Drains · Fixtures</p>
              </div>
            </div>
            <div className="hero-card hero-card-electric">
              <div className="hero-card-icon">⚡</div>
              <div>
                <p className="hero-card-title">Electrical Services</p>
                <p className="hero-card-sub">Wiring · Panels · Fitting</p>
              </div>
            </div>
            <div className="hero-badge">
              <span>✅</span>
              <div>
                <strong>Licensed &amp; Insured</strong>
                <p>All technicians verified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: '⏱️', title: 'Same Day Service', desc: 'Get a technician at your door within hours' },
              { icon: '🛡️', title: 'Fully Licensed', desc: 'All our technicians are certified professionals' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees – you know the cost upfront' },
              { icon: '⭐', title: '5-Star Rated', desc: 'Thousands of satisfied customers across the city' },
            ].map((f) => (
              <div key={f.title} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Our <span className="text-primary">Services</span></h2>
            <p className="section-subtitle">
              From leaky pipes to complete electrical installations — we handle it all.
            </p>
          </div>
          <div className="grid-3">
            {services.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
          <div className="text-center" style={{ marginTop: 40 }}>
            <Link to="/services" className="btn btn-outline btn-lg">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">How It <span className="text-primary">Works</span></h2>
            <p className="section-subtitle">Get professional service in 3 simple steps</p>
          </div>
          <div className="steps">
            {[
              { num: '01', title: 'Create an Account', desc: 'Sign up for free and access all services in seconds.' },
              { num: '02', title: 'Book a Service', desc: 'Fill in your details, choose a service, and submit your request.' },
              { num: '03', title: 'Get It Done', desc: 'Our technician arrives and completes the job. You track the status live.' },
            ].map((step, i) => (
              <div key={i} className="step">
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Owner Teaser */}
      <section className="section bg-light owner-teaser">
        <div className="container">
          <div className="owner-teaser-grid">
            <div className="owner-teaser-image">
              <img src={ownerPhoto} alt="Sangam Raj Mehta" />
            </div>
            <div className="owner-teaser-content">
              <span className="hero-tag">Meet the Expert</span>
              <h2 className="section-title">Expertise by <span className="text-primary">Sangam Raj Mehta</span></h2>
              <p>With years of hands-on experience in both plumbing and electrical systems, Sangam ensures every job is completed with precision and care.</p>
              <Link to="/about" className="btn btn-outline">Read Our Story →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Work Gallery */}
      <section className="section recent-work">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Our Recent <span className="text-primary">Work</span></h2>
            <p className="section-subtitle">Real results for real homeowners across the city.</p>
          </div>
          <div className="work-grid">
            <div className="work-item">
              <img src={project1} alt="Plumbing Project" />
              <div className="work-overlay">
                <h3>Residential Plumbing</h3>
                <p>Complete pipe overhaul</p>
              </div>
            </div>
            <div className="work-item">
              <img src={project2} alt="Electrical Project" />
              <div className="work-overlay">
                <h3>Commercial Electrical</h3>
                <p>Smart lighting installation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Book a Service?</h2>
          <p>Join thousands of satisfied customers. Book your first service today.</p>
          <Link to="/signup" className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary)' }}>
            Get Started Free →
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
