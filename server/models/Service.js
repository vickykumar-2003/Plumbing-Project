const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['Plumbing', 'Electrical', 'Other'],
        default: 'Plumbing'
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '🔧'
    },
    image: {
        type: String,
        default: '/assets/default-service.png'
    },
    price: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
