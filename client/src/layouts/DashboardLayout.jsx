import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children, admin = false, technician = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button onClick={() => setIsSidebarOpen(true)} className="hamburger-btn">☰</button>
        <div className="brand">Sangam Plumbing</div>
      </div>

      <Sidebar
        admin={admin}
        technician={technician}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
