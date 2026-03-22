import { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    // In a real app, this would send an email via API
  };

  return (
    <main className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1 className="section-title">Get in <span className="text-primary">Touch</span></h1>
          <p className="section-subtitle">Have questions or need an emergency service? We're here to help you 24/7.</p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <div>
                <h3>Our Office</h3>
                <p>123 Service Rasulpur, Rohtas, Tiluthu IN</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <div>
                <h3>Phone Number</h3>
                <p>+91 8210276501</p>
                <p>+91 8434876055</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <div>
                <h3>Email Address</h3>
                <p>sangam@gmail.com.com</p>
                <p>info@plumbring.com</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🕘</div>
              <div>
                <h3>Working Hours</h3>
                <p>Mon – Sun: 8:00 AM – 5:00 PM</p>
                <p>24/7 Emergency Support Available</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-card card">
            <div className="card-body">
              {sent ? (
                <div className="alert alert-success">
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. Our team will contact you shortly.</p>
                  <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => setSent(false)}>Send Another Message</button>
                </div>
              ) : (
                <>
                  <h2 className="card-title">Send a Message</h2>
                  <p className="card-subtitle">Fill out the form below and we'll get back to you.</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        placeholder="John Doe"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="you@example.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        className="form-control"
                        placeholder="e.g. Inquiry about pricing"
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        className="form-control"
                        placeholder="How can we help you?"
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Send Message</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
