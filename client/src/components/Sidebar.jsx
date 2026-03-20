import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ admin = false }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{admin ? 'Administrator' : 'Verified User'}</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {admin ? (
            <>
              <li>
                <NavLink to="/admin/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="icon">📊</span> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="icon">📅</span> All Bookings
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="icon">👥</span> Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/services" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="icon">🛠️</span> Manage Services
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="icon">🏠</span> My Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/bookings" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="icon">🕒</span> My Bookings
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="icon">👤</span> My Profile
                </NavLink>
              </li>
            </>
          )}
          <li className="nav-divider"></li>
          <li>
            <NavLink to="/" className="home-link">
              <span className="icon">🌐</span> Visit Site
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <span className="icon">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
