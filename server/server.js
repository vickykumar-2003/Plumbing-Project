const express = require('express');
const mongoose = require('mongoose');
const dns = require("dns");

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);

const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/services', require('./routes/services'));
app.use('/api/technicians', require('./routes/technicians'));
app.use('/api/emergency', require('./routes/emergency'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'PlumbRing API is running 🚀' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

const http = require('http');
const server = http.createServer(app);
const io = require('./socket').init(server);

// Setup basic socket logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Clients can join their own user room (e.g. user ID or 'admin')
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('technician:location:update', async (data) => {
    // data: { technicianId, bookingId, latitude, longitude, timestamp, customerId }
    try {
      if (!data.technicianId || !data.bookingId) return;

      const Booking = require('./models/Booking');
      const User = require('./models/User');

      // Validate that the technician owns/is assigned to the booking
      const validBooking = await Booking.findOne({ _id: data.bookingId, technicianId: data.technicianId });

      if (!validBooking) {
        console.warn(`Unauthorized location update attempt for booking ${data.bookingId} by tech ${data.technicianId}`);
        return;
      }

      await User.findByIdAndUpdate(data.technicianId, {
        currentLocation: {
          lat: data.latitude,
          lng: data.longitude,
          updatedAt: data.timestamp
        }
      });

      await validBooking.populate('userId', 'name');

      const payload = {
        technicianId: data.technicianId,
        bookingId: data.bookingId,
        customerName: validBooking.userId?.name || 'Unknown Route',
        lat: data.latitude,
        lng: data.longitude,
        updatedAt: data.timestamp
      };

      // Broadcast to strictly authorized rooms: Admins and the specific Customer
      io.to('admin').emit('technician:location:update', payload);
      // Wait, customer ID could be extracted from booking if not passed, but data.customerId is passed
      const customerRoom = `user_${validBooking.userId._id.toString()}`;
      io.to(customerRoom).emit('technician:location:update', payload);
    } catch (err) {
      console.error('Socket Location Update Error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
