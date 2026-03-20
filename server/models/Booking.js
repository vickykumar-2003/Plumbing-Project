const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      'Pipe Repair',
      'Drain Cleaning',
      'Water Heater Installation',
      'Leak Detection',
      'Bathroom Fitting',
      'Electrical Wiring',
      'Switch & Socket Installation',
      'Fan & Light Fitting',
      'Circuit Breaker Repair',
      'Electrical Inspection',
    ],
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
