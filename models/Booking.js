const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    adventure: {
        type: mongoose.Schema.ObjectId,
        ref: 'Adventure',
        required: true
    },
    host: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    participants: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'confirmed' // Auto-confirm for this project simulation
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'paid' // Simulated Payment
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
