const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Booking', 'Emergency', 'System', 'Account'],
        default: 'System'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        // Can refer to Booking or EmergencyRequest, but generic
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
