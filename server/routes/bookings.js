const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, isAdmin } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (User)
router.post('/', protect, async (req, res) => {
  try {
    const { name, phone, serviceType, address, message } = req.body;

    if (!name || !phone || !serviceType || !address) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      name,
      phone,
      serviceType,
      address,
      message: message || '',
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/my
// @desc    Get logged-in user's bookings
// @access  Private (User)
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Private (Admin)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Private (Admin)
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private (Admin)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
