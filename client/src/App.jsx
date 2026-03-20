import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Vlog from './pages/Vlog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './pages/UserDashboard';
import UserBookings from './pages/UserBookings';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import AdminServices from './pages/AdminServices';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/vlog" element={<Vlog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Protected User Routes */}
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Routes>
                        <Route path="" element={<UserDashboard />} />
                        <Route path="bookings" element={<UserBookings />} />
                        <Route path="profile" element={<UserProfile />} />
                        <Route path="*" element={<UserDashboard />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <DashboardLayout admin={true}>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="bookings" element={<AdminBookings />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="services" element={<AdminServices />} />
                        <Route path="*" element={<AdminDashboard />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
