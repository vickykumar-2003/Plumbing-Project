const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    emergencyType: {
        type: String,
        required: true,
        enum: [
            'Major Water Leakage',
            'Burst Pipe',
            'No Water Supply',
            'Drainage Emergency',
            'Gas/Water Related Urgent Issue',
            'Other'
        ]
    },
    description: {
        type: String,
        required: true
    },
    location: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    contactPhone: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    priority: {
        type: String,
        enum: ['HIGH', 'CRITICAL'],
        default: 'HIGH'
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'Accepted', 'On The Way', 'Arrived', 'Resolved', 'Cancelled'],
        default: 'Pending'
    },
    technicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    assignedAt: { type: Date },
    resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
