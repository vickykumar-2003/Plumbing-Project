import './About.css';
import ownerPhoto from '../assets/sangam.png'
import vlog1 from '../assets/vlog1.png';
import vlog2 from '../assets/vlog2.png';

const About = () => {
  return (
    <main className="about-page">
      <section className="section bg-light">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-container">
              <div className="owner-card">
                <img src={ownerPhoto} alt="Sangam Raj Mehta" className="owner-photo" />
                <div className="owner-badge">
                  <span className="badge-icon">👨‍🔧</span>
                  <div className="badge-text">
                    <strong>Licensed Pro</strong>
                    <p>2 Yrs Experience</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-content">
              <span className="hero-tag">About Us</span>
              <h1 className="section-title">Meet <span className="text-primary">Sangam Raj Mehta</span> — The Visionary Behind PlumbRing</h1>
              <p className="lead">
                Dedicated to providing top-notch plumbing and electrical services with 
                unwavering integrity and professional excellence.
              </p>
              <div className="about-text">
                <p>
                  PlumbRing was founded with a single mission: to redefine home services through 
                  transparency, reliability, and technical expertise. We understand that home 
                  maintenance can be stressful, which is why we've built a team of certified 
                  professionals who treat your home with the respect it deserves.
                </p>
                <p>
                  Whether it's a minor leak or a major electrical overhaul, our commitment remains 
                  the same — getting the job done right the first time, every time.
                </p>
              </div>
              <div className="stats-mini">
                <div className="stat-box">
                  <strong>100+</strong>
                  <span>Projects Done</span>
                </div>
                <div className="stat-box">
                  <strong>100%</strong>
                  <span>Satisfaction</span>
                </div>
                <div className="stat-box">
                  <strong>24/7</strong>
                  <span>Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Our <span className="text-primary">Core</span> Values</h2>
            <p className="section-subtitle">What drives us to be the best in the industry</p>
          </div>
          <div className="grid-3">
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Safety First</h3>
              <p>We never compromise on safety. All our electrical and plumbing work follows strict international standards.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💎</div>
              <h3>Quality Service</h3>
              <p>We use premium materials and the latest technology to ensure long-lasting results for your home.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Customer Trust</h3>
              <p>Transparency in pricing and honest assessments are the foundation of our customer relationships.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Plumbing Vlogs Section */}
      <section className="section bg-light plumbing-vlogs">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Plumbing <span className="text-primary">Vlogs</span> & Tips</h2>
            <p className="section-subtitle">Watch Sangam in action as he shares professional plumbing tips and project highlights.</p>
          </div>
          <div className="vlog-grid">
            <div className="vlog-card">
              <div className="vlog-thumbnail">
                <img src={vlog1} alt="Faucets & Taps Tutorial" />
                <div className="play-button">▶</div>
                <div className="vlog-tag">Tutorial</div>
              </div>
              <div className="vlog-info">
                <h3>How to Fix a Leaky Tap in 5 Minutes</h3>
                <p>Simple DIY tips to save water and money.</p>
              </div>
            </div>
            <div className="vlog-card">
              <div className="vlog-thumbnail vlog-2">
                <img src={vlog2} alt="Drain Tips Project" />
                <div className="play-button">▶</div>
                <div className="vlog-tag">Project</div>
              </div>
              <div className="vlog-info">
                <h3>Full Bathroom Pipe Installation</h3>
                <p>A complete walkthrough of our recent commercial project.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
