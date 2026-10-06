const express = require("express");
const router = express.Router();

const Review = require("../models/Review");
const Booking = require("../models/Booking");
const User = require("../models/User");

const { protect } = require("../middleware/auth");


//CREATE REVIEW
router.post("/", protect, async (req, res) => {
    try {
         const { bookingId, rating, comment } = req.body;

         if(!bookingId || !rating || comment){
            return res.status(400).json({
                message: "Booking, rating and comment are required"
            });
         }

         // Find booking
         const booking = await Booking.findById(bookingId);

         if(!booking){
            return res.status(404).json({
                message: "Booking not found"
            });
         }

         // Check booking belongs to logged-in user
         if(booking.userId.toString() !== req.user.id){
            return res.status(403).json({
                message: "You are not allowed to review this booking"
            });
         }

         //Review only after completed
         if(booking.status !== "Completed"){
            return res.status(400).json({
                message: "You can review only after service is complete"
            });
         }

         //Check technician exists
         if(!booking.technicianId){
            return res.status(400).json({
                message: "No technician assigned to this booking"
            });
         }

         // Check duplicate review
         const existingReview = await Review.findOne({
            bookingId
         });

         if(existingReview){
            return res.status(400).json({
                message: "You have already reviewed this booking"
            });
         }

         // Create review
         const review = await Review.create({
            bookingId,
            userId: req.user.id,
            technicianId: booking.technicianId,
            rating,
            comment
         });

         //Calculate technicain average rating
         const reviews = await Review.find({
            technicianId: booking.technicianId
         });

         const totalRating = reviews.reduce(
            (sum, item) => sum + item.rating,
            0
         );

         const averageRating = totalRating / reviews.length;

         // Update technicain rating
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
    }
    catch (error) {
        console.error("Review error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;