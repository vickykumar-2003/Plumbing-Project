const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/EmergencyRequest');
const { protect, isAdmin, isTechnician } = require('../middleware/auth');

// @route   POST /api/emergency
// @desc    Create a new emergency request
// @access  Private (User)
router.post('/', protect, async (req, res) => {
    try {
        const { emergencyType, description, address, contactPhone, priority } = req.body;

        if (!emergencyType || !description || !address || !contactPhone) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const emergency = await EmergencyRequest.create({
            userId: req.user.id,
            emergencyType,
            description,
            location: { address },
            contactPhone,
            priority: priority || 'HIGH'
        });

        const io = require('../socket').getIO();
        io.to('admin').emit('new-emergency', emergency); // notify admins

        res.status(201).json({ message: 'Emergency request submitted!', emergency });
    } catch (error) {
        console.error('Create emergency error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/emergency
// @desc    Get all emergency requests
// @access  Private (Admin)
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const emergencies = await EmergencyRequest.find()
            .populate('userId', 'name email')
            .populate('technicianId', 'name phone')
            .sort({ createdAt: -1 });
        res.json(emergencies);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/emergency/:id/assign
// @desc    Assign emergency to tech
// @access  Private (Admin)
router.put('/:id/assign', protect, isAdmin, async (req, res) => {
    try {
        const { technicianId } = req.body;
        const emergency = await EmergencyRequest.findByIdAndUpdate(
            req.params.id,
            { technicianId, status: 'Assigned', assignedAt: new Date() },
            { new: true }
        ).populate('technicianId', 'name phone');

        if (!emergency) return res.status(404).json({ message: 'Not found' });

        const io = require('../socket').getIO();
        io.to(technicianId).emit('emergency-assigned', emergency); // Notify the specifically assigned tech
        io.to(`user_${emergency.userId}`).emit('emergency-update', emergency); // notify customer

        res.json({ message: 'Technician dispatched successfully', emergency });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/emergency/:id/status
// @desc    Update status of emergency
// @access  Private (Admin or Tech)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const emergency = await EmergencyRequest.findById(req.params.id);

        if (!emergency) return res.status(404).json({ message: 'Not found' });

        // Auth check
        if (req.user.role !== 'admin' && emergency.technicianId?.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        emergency.status = status;
        if (status === 'Resolved') emergency.resolvedAt = new Date();
        await emergency.save();

        const io = require('../socket').getIO();
        io.to('admin').emit('emergency-update', emergency); // notify admin
        io.to(`user_${emergency.userId}`).emit('emergency-update', emergency); // notify user

        res.json({ message: 'Emergency status updated', emergency });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
