import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children, admin = false }) => {
  return (
    <div className="dashboard-layout" style={{ display: 'flex', background: '#f1f5f9', minHeight: '100vh' }}>
      <Sidebar admin={admin} />
      <main className="dashboard-content" style={{ flex: 1, padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
