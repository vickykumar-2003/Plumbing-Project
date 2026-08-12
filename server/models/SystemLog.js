const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Can be null if system generated
    },
    action: {
        type: String,
        required: true
    },
    entity: {
        type: String,
        enum: ['Booking', 'Emergency', 'User', 'Service', 'System'],
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    status: {
        type: String,
        enum: ['Success', 'Warning', 'Error', 'Info'],
        default: 'Info'
    },
    details: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemLog', systemLogSchema);
