const express = require("express");
const router = express.Router();

const Review = require("../models/Review");
const Booking = require("../models/Booking");
const User = require("../models/User");

const { protect } = require("../middleware/auth");

// CREATE REVIEW
router.post("/", protect, async (req, res) => {
  try {
    console.log("========== REVIEW REQUEST ==========");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { bookingId, rating, comment } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is missing"
      });
    }

    if (!rating) {
      return res.status(400).json({
        message: "Rating is required"
      });
    }

    if (!comment?.trim()) {
      return res.status(400).json({
        message: "Feedback is required"
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    // Check booking belongs to logged-in user
    if (booking.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to review this booking"
      });
    }

    // Review only after completed
    if (booking.status !== "Completed") {
      return res.status(400).json({
        message: "You can review only after service is complete"
      });
    }

    // Check technician exists
    if (!booking.technicianId) {
      return res.status(400).json({
        message: "No technician assigned to this booking"
      });
    }

    // Check duplicate review
    const existingReview = await Review.findOne({
      bookingId
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this booking"
      });
    }

    // Create review
    const review = await Review.create({
      bookingId,
      userId: req.user.id,
      technicianId: booking.technicianId,
      rating: Number(rating),
      comment: comment.trim()
    });

    // Calculate technician average rating
    const reviews = await Review.find({
      technicianId: booking.technicianId
    });

    const totalRating = reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const averageRating = totalRating / reviews.length;

    // Update technician rating
    await User.findByIdAndUpdate(
      booking.technicianId,
      {
        rating: Number(averageRating.toFixed(1))
      }
    );

    res.status(201).json({
      message: "Review submitted successfully",
      review,
      averageRating: Number(averageRating.toFixed(1))
    });

  } catch (error) {
    console.error("Review error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;