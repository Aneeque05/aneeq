const mongoose = require('mongoose');

const AdventureSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Trekking',
            'Water',
            'Camping',
            'Biking',
            'Nature',
            'Cultural'
        ]
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    location: {
        type: String, // Simplified for this project, could be GeoJSON
        required: [true, 'Please add an address']
    },
    city: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description can not be more than 1000 characters']
    },
    included: {
        type: [String]
    },
    notIncluded: {
        type: [String]
    },
    pricePerPerson: {
        type: Number,
        required: [true, 'Please add a price']
    },
    groupDiscount: {
        threshold: { type: Number, default: 4 },
        discountPrice: { type: Number }
    },
    images: {
        type: [String],
        default: ['no-photo.jpg']
    },
    image: {
        type: String,
        required: false
    },
    fullDescription: {
        type: String,
        required: false
    },
    highlights: {
        type: [String],
        required: false
    },
    itinerary: {
        type: [{
            day: Number,
            title: String,
            description: String
        }],
        required: false
    },
    safetyInfo: {
        type: String,
        required: false
    },
    duration: {
        type: String,
        required: true
    },
    bestSeason: {
        type: String
    },
    maxSeats: {
        type: Number,
        required: true
    },
    reservedSeats: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 5']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Adventure', AdventureSchema);
