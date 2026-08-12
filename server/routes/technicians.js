const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, isAdmin, isTechnician } = require('../middleware/auth');

// @route   GET /api/technicians
// @desc    Get all technicians
// @access  Private (Admin)
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const technicians = await User.find({ role: 'technician' }).select('-password -__v');
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/technicians/available
// @desc    Get all AVAILABLE technicians
// @access  Private (Admin / System)
router.get('/available', protect, isAdmin, async (req, res) => {
    try {
        const technicians = await User.find({ role: 'technician', isAvailable: true }).select('-password -__v');
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/technicians
// @desc    Create a new technician
// @access  Private (Admin)
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const { name, email, password, phone, skills } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const technician = await User.create({
            name,
            email,
            password,
            role: 'technician',
            phone,
            skills: skills || []
        });

        res.status(201).json({
            message: 'Technician created successfully',
            technician: {
                _id: technician._id,
                name: technician.name,
                email: technician.email,
                role: technician.role,
                isAvailable: technician.isAvailable
            }
        });
    } catch (error) {
        console.error('Create technician error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/technicians/me/status
// @desc    Toggle technician availability
// @access  Private (Technician)
router.put('/me/status', protect, isTechnician, async (req, res) => {
    try {
        const { isAvailable } = req.body;

        // req.user.id is the technician context
        const tech = await User.findById(req.user.id);
        if (!tech) {
            return res.status(404).json({ message: 'Technician not found' });
        }

        tech.isAvailable = typeof isAvailable === 'boolean' ? isAvailable : !tech.isAvailable;
        await tech.save();

        res.json({ message: 'Status updated', isAvailable: tech.isAvailable });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/technicians/:id
// @desc    Update a technician
// @access  Private (Admin)
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const { name, phone, skills, isAvailable, rating } = req.body;

        const technician = await User.findById(req.params.id);
        if (!technician || technician.role !== 'technician') {
            return res.status(404).json({ message: 'Technician not found' });
        }

        if (name) technician.name = name;
        if (phone) technician.phone = phone;
        if (skills) technician.skills = skills;
        if (typeof isAvailable !== 'undefined') technician.isAvailable = isAvailable;
        if (rating) technician.rating = rating;

        await technician.save();

        res.json({ message: 'Technician updated successfully', technician });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/technicians/:id
// @desc    Delete a technician
// @access  Private (Admin)
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        const technician = await User.findByIdAndDelete(req.params.id);
        if (!technician) {
            return res.status(404).json({ message: 'Technician not found' });
        }
        res.json({ message: 'Technician deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
