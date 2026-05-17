const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, isAdmin } = require('../middleware/auth');
const sendEmailNotification = require('../utils/emailService');

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

    // Send email notification to Admin using our new emailService
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      
      if (adminEmail) {
        // Create a nicely formatted HTML email for the admin
        const htmlMessage = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0056b3; text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">New Service Booking</h2>
            <p style="font-size: 16px; color: #333;">Hello Admin,</p>
            <p style="font-size: 15px; color: #555;">A new customer has just booked a service. Here are the details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 35%;">Customer Name:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone Number:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Service Type:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${serviceType}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Booking Date:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Address:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${address}</td>
              </tr>
            </table>

            <div style="margin-top: 20px; text-align: center;">
              <p style="font-size: 14px; color: #888;">Please login to your admin dashboard to manage this booking.</p>
            </div>
          </div>
        `;
        
        await sendEmailNotification({
          to: adminEmail,
          subject: '🔔 Alert: New Service Booking Received',
          html: htmlMessage,
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // We catch the error so the booking process doesn't fail if the email fails
    }

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
