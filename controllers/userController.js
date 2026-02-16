const User = require('../models/User');
const Adventure = require('../models/Adventure');

// @desc    Get current logged in user details
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Toggle Wishlist Item
// @route   PUT /api/users/wishlist/:adventureId
// @access  Private
exports.toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const adventureId = req.params.adventureId;

        // Check if adventure exists
        const adventure = await Adventure.findById(adventureId);
        if (!adventure) {
            return res.status(404).json({ success: false, message: 'Adventure not found' });
        }

        // Check if already in wishlist
        const index = user.wishlist.indexOf(adventureId);

        if (index > -1) {
            // Remove
            user.wishlist.splice(index, 1);
        } else {
            // Add
            user.wishlist.push(adventureId);
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: user.wishlist
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}
