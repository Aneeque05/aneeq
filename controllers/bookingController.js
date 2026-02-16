const Booking = require('../models/Booking');
const Adventure = require('../models/Adventure');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        req.body.user = req.user.id;

        const adventure = await Adventure.findById(req.body.adventure);

        if (!adventure) {
            return res.status(404).json({ success: false, message: 'Adventure not found' });
        }

        // Add host from adventure
        req.body.host = adventure.host;

        // Simple Calculate Total Price based on logic
        let price = adventure.pricePerPerson;
        if (adventure.groupDiscount && req.body.participants >= adventure.groupDiscount.threshold) {
            price = adventure.groupDiscount.discountPrice || price; // Use discount price if logic applies
        }
        req.body.totalPrice = price * req.body.participants;

        const booking = await Booking.create(req.body);

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get my bookings
// @route   GET /api/bookings/mybookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate({
            path: 'adventure',
            select: 'title images location city'
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get host bookings
// @route   GET /api/bookings/hostbookings
// @access  Private (Host)
exports.getHostBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ host: req.user.id }).populate({
            path: 'adventure',
            select: 'title'
        }).populate({
            path: 'user',
            select: 'name email'
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
