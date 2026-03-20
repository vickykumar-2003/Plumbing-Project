import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const UserProfile = () => {
  const { user } = useAuth();
  
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Profile update functionality coming soon!');
  };

  return (
    <div className="dashboard-page overflow-x-hidden">
      <div className="dashboard-header">
        <h1 className="section-title">My <span className="text-primary">Profile</span></h1>
        <p>Manage your personal information and account settings.</p>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '600px' }}>
        <div className="dashboard-form-card card">
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--gray-900)' }}>{user?.name || 'Guest User'}</h2>
                <div style={{ color: 'var(--gray-600)', marginTop: '4px' }}>
                  <span className="badge badge-completed">{user?.role === 'admin' ? 'Administrator' : 'Standard User'}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" defaultValue={user?.name} readOnly />
                <small style={{ color: 'var(--gray-400)', display: 'block', marginTop: '4px' }}>Name updates are currently disabled.</small>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" defaultValue={user?.email} readOnly />
                <small style={{ color: 'var(--gray-400)', display: 'block', marginTop: '4px' }}>Your login email cannot be changed.</small>
              </div>

              <div className="form-group">
                <label>Joined On</label>
                <input type="text" className="form-control" defaultValue={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} readOnly />
              </div>
              
              <button type="submit" className="btn btn-outline" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
