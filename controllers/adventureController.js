const Adventure = require('../models/Adventure');

// @desc    Get all adventures
// @route   GET /api/adventures
// @access  Public
exports.getAdventures = async (req, res) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|regex)\b/g, match => `$${match}`);

        // Finding resource
        // Basic search implementation for 'keyword'
        let mongoQuery = JSON.parse(queryStr);

        if (req.query.keyword) {
            mongoQuery = {
                ...mongoQuery,
                $or: [
                    { title: { $regex: req.query.keyword, $options: 'i' } },
                    { city: { $regex: req.query.keyword, $options: 'i' } }
                ]
            };
            delete mongoQuery.keyword;
        }

        query = Adventure.find(mongoQuery);

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Adventure.countDocuments(mongoQuery);

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const adventures = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: adventures.length,
            pagination,
            data: adventures
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single adventure
// @route   GET /api/adventures/:id
// @access  Public
exports.getAdventure = async (req, res) => {
    try {
        const adventure = await Adventure.findById(req.params.id).populate('host', 'name email');

        if (!adventure) {
            return res.status(404).json({ success: false, message: 'Adventure not found' });
        }

        res.status(200).json({ success: true, data: adventure });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new adventure
// @route   POST /api/adventures
// @access  Private (Host/Admin)
exports.createAdventure = async (req, res) => {
    try {
        // Add user to req.body
        req.body.host = req.user.id;

        const adventure = await Adventure.create(req.body);

        res.status(201).json({
            success: true,
            data: adventure
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update adventure
// @route   PUT /api/adventures/:id
// @access  Private (Host/Admin)
exports.updateAdventure = async (req, res) => {
    try {
        let adventure = await Adventure.findById(req.params.id);

        if (!adventure) {
            return res.status(404).json({ success: false, message: 'Adventure not found' });
        }

        // Make sure user is adventure owner
        if (adventure.host.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this adventure' });
        }

        adventure = await Adventure.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: adventure });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete adventure
// @route   DELETE /api/adventures/:id
// @access  Private (Host/Admin)
exports.deleteAdventure = async (req, res) => {
    try {
        const adventure = await Adventure.findById(req.params.id);

        if (!adventure) {
            return res.status(404).json({ success: false, message: 'Adventure not found' });
        }

        // Make sure user is adventure owner
        if (adventure.host.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this adventure' });
        }

        await adventure.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
