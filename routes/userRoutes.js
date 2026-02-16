const express = require('express');
const { getMe, toggleWishlist } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.put('/wishlist/:adventureId', toggleWishlist);

module.exports = router;
