const express = require('express');
const {
    getAdventures,
    getAdventure,
    createAdventure,
    updateAdventure,
    deleteAdventure
} = require('../controllers/adventureController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getAdventures)
    .post(protect, authorize('host', 'admin'), createAdventure);

router.route('/:id')
    .get(getAdventure)
    .put(protect, authorize('host', 'admin'), updateAdventure)
    .delete(protect, authorize('host', 'admin'), deleteAdventure);

module.exports = router;
