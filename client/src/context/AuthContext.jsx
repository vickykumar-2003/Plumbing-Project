import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [socketStatus, setSocketStatus] = useState('Disconnected');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      initSocket(parsedUser);
    }
    setLoading(false);

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initSocket = (userData) => {
    let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const socketUrl = backendUrl.replace(/\/api\/?$/, '');

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: { token: localStorage.getItem('token') } // Pass token for backend validation
    });

    newSocket.on('connect', () => {
      console.log('Socket connected natively to', socketUrl);
      setSocketStatus('Connected');
      if (userData.role === 'admin') {
        newSocket.emit('join', 'admin');
      } else if (userData.role === 'technician') {
        newSocket.emit('join', userData.id || userData._id);
      } else {
        newSocket.emit('join', `user_${userData.id || userData._id}`);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setSocketStatus('Reconnecting...');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setSocketStatus('Disconnected');
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    // Subscribing to flash alerts for admins
    newSocket.on('new-emergency', (data) => {
      if (userData.role === 'admin') {
        alert(`🚨 NEW EMERGENCY DISPATCH!\nType: ${data.emergencyType}\nLocation: ${data.location.address}`);
      }
    });

    newSocket.on('new-booking', (data) => {
      if (userData.role === 'admin') {
        alert(`🔔 NEW STANDARD BOOKING!\nType: ${data.serviceType}\nPlaced By: ${data.name}`);
      }
    });

    // Subscribing to booking updates (applicable for customer/technician/admin)
    newSocket.on('booking-update', (data) => {
      // Simple notification (we can use better react-toastify later)
      if (userData.role === 'user') {
        alert(`UPDATE ON YOUR BOOKING!\nYour service status is now: ${data.status}`);
      }
    });

    setSocket(newSocket);
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    initSocket(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setSocketStatus('Disconnected');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, socket, socketStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
