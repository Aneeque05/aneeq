const express = require('express');
const {
    createBooking,
    getMyBookings,
    getHostBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createBooking);

router.route('/mybookings')
    .get(getMyBookings);

router.route('/hostbookings')
    .get(authorize('host', 'admin'), getHostBookings);

module.exports = router;
