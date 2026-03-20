import { useEffect, useState } from 'react';
import api from '../api';
import ServiceCard from '../components/ServiceCard';
import './Services.css';

const fallbackServices = [
  { id: 1, title: 'Pipe Leak Repair', category: 'Plumbing', description: 'Fast and reliable fixes for all types of pipe leaks.', icon: '💧', image: 'https://images.unsplash.com/photo-1607472586893-edb57cb5b2b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: 2, title: 'Drain Cleaning', category: 'Plumbing', description: 'Clear clogged drains quickly with our professional tools.', icon: '🚿', image: 'https://images.unsplash.com/photo-1581561515458-3e5f157adadb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: 3, title: 'Wiring & Panels', category: 'Electrical', description: 'Expert residential and commercial wiring services.', icon: '🔌', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: 4, title: 'Fixture Setup', category: 'Electrical', description: 'Safe installation of lighting and electrical fixtures.', icon: '💡', image: 'https://images.unsplash.com/photo-1558402529-d2638a7023e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: 5, title: 'Water Heaters', category: 'Plumbing', description: 'Installation and repair of water heating systems.', icon: '🔥', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  { id: 6, title: 'Smart Home', category: 'Electrical', description: 'Upgrade your home with smart electrical systems.', icon: '🏠', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [activeModal, setActiveModal] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [modalState, setModalState] = useState('initial'); // initial, processing, success

  useEffect(() => {
    api.get('/services')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setServices(res.data);
        } else {
          setServices(fallbackServices);
        }
      })
      .catch(err => {
        console.error('API failed, using fallback services', err);
        setServices(fallbackServices);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? services : services.filter(s => s.category === filter);

  const handleCardClick = (title) => {
    if (title === 'Easy Payment') {
      setActiveModal('payment');
      setModalState('initial');
    }
    if (title === 'Fast Response') {
      setActiveModal('fastResponse');
      setModalState('initial');
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setPhoneInput('');
  };

  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    if (!phoneInput) return;
    setModalState('processing');
    setTimeout(() => {
      setModalState('success');
    }, 1500);
  };

  const handlePayment = (method) => {
    setModalState('processing');
    setTimeout(() => {
      setModalState('success');
    }, 2000);
  };

  return (
    <main>
      {/* Page Header */}
      <div className="services-header">
        <div className="container">
          <h1 className="section-title">Our <span className="text-primary">Services</span></h1>
          <p className="section-subtitle" style={{ margin: '12px auto 0' }}>
            Professional plumbing and electrical solutions for every need.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <section className="section-sm">
        <div className="container">
          <div className="filter-tabs">
            {['All', 'Plumbing', 'Electrical'].map(tab => (
              <button
                key={tab}
                className={`filter-tab ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab === 'All' ? '🏠 All' : tab === 'Plumbing' ? '🔧 Plumbing' : '⚡ Electrical'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner-wrapper"><div className="spinner"></div></div>
          ) : (
            <div className="grid-3">
              {filtered.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose <span className="text-primary">PlumbRing?</span></h2>
          <div className="why-grid">
            {[
              { icon: '🎓', title: 'Certified Experts', desc: 'All technicians hold valid licenses and certifications.', clickable: false },
              { icon: '📞', title: '24/7 Support', desc: "Emergency? We're always just one call away.", clickable: false },
              { icon: '💳', title: 'Easy Payment', desc: 'Click here to test our instant payment gateway integration.', clickable: true },
              { icon: '🔒', title: 'Safe & Insured', desc: 'All our work is fully insured for your peace of mind.', clickable: false },
              { icon: '⚡', title: 'Fast Response', desc: 'Click here to trigger an emergency rapid dispatch alert.', clickable: true },
              { icon: '📋', title: 'Detailed Reports', desc: 'Get a full work report after every service visit.', clickable: false },
            ].map((item, index) => (
              <div 
                key={item.title} 
                className={`why-card ${item.clickable ? 'clickable-card' : ''}`} 
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCardClick(item.title)}
              >
                {item.clickable && <div className="interactive-badge">Try It!</div>}
                <div className="card-body">
                  <div className="icon-wrapper">
                    <span className="why-icon">{item.icon}</span>
                  </div>
                  <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {item.title}
                    {item.clickable && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', animation: 'pulse 1.5s infinite' }}>↗</span>}
                  </h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            {activeModal === 'fastResponse' && (
              <div className="modal-body emergency-modal">
                <div className="modal-icon warning">🚨</div>
                <h2>Emergency Dispatch</h2>
                
                {modalState === 'initial' && (
                  <>
                    <p>Trigger an emergency alert to dispatch the closest available technician immediately.</p>
                    <form onSubmit={handleEmergencySubmit}>
                      <input 
                        type="tel" 
                        placeholder="Enter your mobile number" 
                        required 
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="form-control"
                        style={{ marginBottom: '16px', textAlign: 'center', fontSize: '1.2rem', padding: '16px' }}
                      />
                      <button type="submit" className="btn btn-danger w-100" style={{ width: '100%', fontSize: '1.1rem', padding: '14px' }}>
                        DISPATCH TECHNICIAN NOW
                      </button>
                    </form>
                  </>
                )}
                {modalState === 'processing' && (
                  <div className="processing-state">
                    <div className="spinner" style={{ borderColor: 'var(--danger) transparent var(--danger) transparent', margin: '0 auto 16px' }}></div>
                    <p>Locating nearest technician...</p>
                  </div>
                )}
                {modalState === 'success' && (
                  <div className="success-state">
                    <div className="success-icon" style={{ color: 'var(--success)', fontSize: '4rem', marginBottom: '16px' }}>✅</div>
                    <h3 style={{ color: 'var(--success)' }}>Technician Dispatched!</h3>
                    <p>Mr. Rajesh (Plumber) is 2.5km away and arriving in approx <strong>12 mins</strong>.</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginTop: '8px' }}>Tracking link sent to {phoneInput || 'your number'}</p>
                  </div>
                )}
              </div>
            )}

            {activeModal === 'payment' && (
              <div className="modal-body payment-modal">
                <div className="modal-icon payment">💳</div>
                <h2>Secure PayGateway</h2>
                
                {modalState === 'initial' && (
                  <>
                    <p style={{ marginBottom: '24px', color: 'var(--gray-600)' }}>Select a payment method to securely process your transaction.</p>
                    <div className="payment-options">
                      <button className="payment-btn" onClick={() => handlePayment('UPI')}>
                        <span className="pay-icon">📱</span> Pay via UPI (GPay/PhonePe)
                      </button>
                      <button className="payment-btn" onClick={() => handlePayment('Card')}>
                        <span className="pay-icon">💳</span> Credit / Debit Card
                      </button>
                      <button className="payment-btn" onClick={() => handlePayment('NetBanking')}>
                        <span className="pay-icon">🏦</span> Net Banking
                      </button>
                    </div>
                  </>
                )}
                {modalState === 'processing' && (
                  <div className="processing-state">
                    <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                    <p>Connecting to bank securely...</p>
                  </div>
                )}
                {modalState === 'success' && (
                  <div className="success-state">
                    <div className="success-icon" style={{ color: 'var(--success)', fontSize: '4rem', marginBottom: '16px' }}>💸</div>
                    <h3 style={{ color: 'var(--success)' }}>Payment Successful!</h3>
                    <p>Transaction ID: TXN-{Math.floor(Math.random() * 1000000000)}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginTop: '8px' }}>A receipt has been emailed to you.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Services;
