// Vlog.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Vlog.css';

const dummyVlogs = [
  {
    id: 1,
    title: 'How to Fix a Leaking Faucet DIY',
    category: 'Plumbing',
    duration: '05:22',
    date: 'Oct 12, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1581561515458-3e5f157adadb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    views: '12K',
  },
  {
    id: 2,
    title: 'Top 5 Smart Home Electrical Upgrades',
    category: 'Electrical',
    duration: '08:45',
    date: 'Nov 04, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    views: '8.5K',
  },
  {
    id: 3,
    title: 'Why You Should Never Use Chemical Drain Cleaners',
    category: 'Plumbing',
    duration: '04:15',
    date: 'Dec 18, 2023',
    thumbnail: 'https://images.unsplash.com/photo-1607472586893-edb57cb5b2b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    views: '24K',
  },
  {
    id: 4,
    title: 'Circuit Breaker Tripping? Heres Why',
    category: 'Electrical',
    duration: '06:30',
    date: 'Jan 22, 2024',
    thumbnail: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    views: '15K',
  },
  {
    id: 5,
    title: 'Choosing the Right Water Heater for Your Home',
    category: 'Plumbing',
    duration: '10:05',
    date: 'Feb 10, 2024',
    thumbnail: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    views: '9.2K',
  },
  {
    id: 6,
    title: 'Lighting Design Trends 2024',
    category: 'Electrical',
    duration: '07:12',
    date: 'Mar 05, 2024',
    thumbnail: 'https://images.unsplash.com/photo-1558402529-d2638a7023e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    views: '18K',
  }
];

const Vlog = () => {
  const [filter, setFilter] = useState('All');

  const filteredVlogs = filter === 'All' 
    ? dummyVlogs 
    : dummyVlogs.filter(vlog => vlog.category === filter);

  return (
    <main className="vlog-page">
      {/* Header Section */}
      <section className="vlog-hero">
        <div className="container">
          <h1 className="vlog-title">PlumbRing <span className="text-accent">Vlog</span></h1>
          <p className="vlog-subtitle">
            Tips, tutorials, and expert advice on plumbing and electrical work.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="vlog-content section">
        <div className="container">
          {/* Filters */}
          <div className="vlog-filters">
            {['All', 'Plumbing', 'Electrical'].map(f => (
              <button 
                key={f}
                className={`vlog-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Video Grid */}
          <div className="vlog-grid">
            {filteredVlogs.map((vlog, index) => (
              <div 
                key={vlog.id} 
                className="vlog-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="vlog-thumbnail-wrapper">
                  <img src={vlog.thumbnail} alt={vlog.title} className="vlog-thumbnail" />
                  <div className="vlog-play-btn">
                    <span className="play-icon">▶</span>
                  </div>
                  <span className="vlog-duration">{vlog.duration}</span>
                </div>
                <div className="vlog-card-body">
                  <div className="vlog-meta">
                    <span className={`vlog-badge ${vlog.category.toLowerCase()}`}>{vlog.category}</span>
                    <span className="vlog-date">{vlog.date}</span>
                  </div>
                  <h3 className="vlog-card-title">{vlog.title}</h3>
                  <div className="vlog-footer">
                    <span className="vlog-views">👁 {vlog.views} Views</span>
                    <Link to="#" className="vlog-watch-link">Watch Now →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter / CTA */}
          <div className="vlog-cta">
            <div className="vlog-cta-content">
              <h2>Subscribe for Updates</h2>
              <p>Get the latest DIY tips and maintenance guides delivered to your inbox.</p>
              <form className="vlog-subscribe-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email address" className="form-control" />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Vlog;
