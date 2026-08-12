const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'technician'],
    default: 'user',
  },
  phone: {
    type: String,
    trim: true,
  },
  // Technician specific fields
  isAvailable: {
    type: Boolean,
    default: true,
  },
  skills: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 5.0,
  },
  completedJobs: {
    type: Number,
    default: 0,
  },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date }
  },
  activeJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
