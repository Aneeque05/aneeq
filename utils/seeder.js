const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/User');
const Adventure = require('../models/Adventure');
const Booking = require('../models/Booking');
const connectDB = require('../config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/adventure_booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const generateAdventures = (hostId) => {
    // Helper to pick random element
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    // Helper for random price
    const randomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    // Helper for random rating
    const randomRating = () => (Math.random() * (5 - 3.5) + 3.5).toFixed(1);

    const trekkingList = [
        "Mountain Trekking", "Forest Trekking", "Waterfall Trekking", "Sunrise Trek", "Sunset Trek",
        "Hilltop Trek", "Jungle Trekking", "River Trail Trek", "Night Trekking", "Heritage Trek",
        "Wildlife Trek", "Rock Trail Trek", "Valley Trek", "Tea Plantation Trek", "Off-road Trek",
        "Beginner Trek", "Advanced Trek", "Guided Trekking Tour", "Photography Trek", "Multi-day Trek"
    ];

    const waterList = [
        "Kayaking", "Canoeing", "River Rafting", "Scuba Diving", "Snorkeling",
        "Jet Ski Ride", "Banana Boat Ride", "Speed Boat Ride", "Stand-Up Paddle Boarding", "Cliff Jumping",
        "Waterfall Swimming", "Backwater Boating", "Fishing Trip", "Parasailing", "Surfing",
        "Water Tubing", "Lagoon Swimming", "Island Boat Tour", "River Crossing", "Water Zipline"
    ];

    const campingList = [
        "Riverside Camping", "Forest Camping", "Hilltop Camping", "Beach Camping", "Desert Camping",
        "Night Camping", "Adventure Camping", "Family Camping", "Luxury Glamping", "Tent Camping",
        "Bonfire Camping", "Stargazing Camping", "Eco Camping", "Wildlife Camping", "Group Camping",
        "Solo Camping", "Survival Camping", "Mountain Camping", "Rainforest Camping", "Weekend Camping Package"
    ];

    const bikingList = [
        "Mountain Biking", "Off-road Biking", "Long Distance Bike Ride", "Coastal Bike Ride", "Forest Bike Trail",
        "Hill Ride", "Sunrise Bike Ride", "Sunset Bike Ride", "Guided Bike Tour", "Adventure Bike Expedition",
        "Dirt Trail Riding", "Village Bike Tour", "Highway Ride", "Group Bike Ride", "Motorcycle Camping Ride",
        "Scenic Route Ride", "Heritage Bike Ride", "Beginner Bike Ride", "Advanced Bike Ride", "Weekend Bike Trip"
    ];

    const adjectives = ["Amazing", "Breath-taking", "Thrilling", "Peaceful", "Extreme", "Ultimate", "Scenic", "Hidden"];
    const locations = ["Meghalaya", "Rishikesh", "Manali", "Goa", "Kerala", "Ladakh", "Coorg", "Ooty", "Andaman", "Sikkim"];

    // Build adventure with SMART IMAGE MATCHING
    const buildAdventure = (title, category, index) => {
        // Extract keywords from title for better image matching
        let keywords = title.toLowerCase().replace(/ /g, ',');

        // Strict Image Matching based on Category
        let imageKeyword = 'adventure';
        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('trek') || category === 'Trekking') imageKeyword = 'mountain,hiker';
        else if (lowerTitle.includes('camp') || category === 'Camping') imageKeyword = 'tent,camping,bonfire';
        else if (lowerTitle.includes('water') || lowerTitle.includes('raft') || category === 'Water') imageKeyword = 'kayak,river,rafting';
        else if (lowerTitle.includes('bike') || lowerTitle.includes('cycle') || category === 'Biking') imageKeyword = 'mountainbike,cycling';
        else if (lowerTitle.includes('goa') || lowerTitle.includes('beach')) imageKeyword = 'beach,ocean';

        // Add a random lock to ensure variety even with same keywords
        const imgUrl = `https://loremflickr.com/800/600/${imageKeyword}?lock=${index}`;

        return {
            host: hostId,
            title: `${pick(adjectives)} ${title}`,
            category: category, // Already lowercase from the call
            difficulty: pick(['Easy', 'Medium', 'Hard']),
            city: pick(locations),
            location: `${pick(locations)} Region`,
            description: `Experience the thrill of ${title} in the beautiful landscapes of ${pick(locations)}. Includes expert guides and safety gear. Perfect for adventure lovers.`,
            fullDescription: `Embark on an unforgettable journey with our ${title} package. This adventure takes you through the heart of ${pick(locations)}, offering breathtaking views and adrenaline-pumping moments. Whether you are a beginner or an expert, our professional guides ensure a safe and thrilling experience. You will explore hidden gems, enjoy local cuisine, and make memories that last a lifetime.`,
            highlights: [
                `Experience ${title} with professional guides`,
                `Explore the scenic beauty of ${pick(locations)}`,
                "Safety gear and equipment included",
                "Complimentary local snacks and drinks",
                "Photography and memory capture included"
            ],
            itinerary: [
                { day: 1, title: "Arrival & Briefing", description: "Meet at the base camp, introduction to the team, and safety briefing." },
                { day: 2, title: "The Adventure Begins", description: `Start the ${title} activity. Enjoy the thrill and scenic views.` },
                { day: 3, title: "Departure", description: "Breakfast at the camp and departure with fond memories." }
            ],
            safetyInfo: "All participants must follow the guide's instructions. detailed safety gear is provided. Please inform us of any medical conditions beforehand.",
            pricePerPerson: randomPrice(800, 5000),
            duration: pick(['1 Day', '2 Days / 1 Night', '3 Hours', '5 Hours']),
            maxSeats: randomPrice(5, 20),
            image: imgUrl,
            images: [imgUrl],
            averageRating: randomRating(),
            included: ["Guide", "Equipment", "Snacks", "First Aid"],
            notIncluded: ["Transport to Base Camp", "Personal Expenses", "Insurance"]
        };
    }

    const allAdventures = [];

    // Use capitalized categories here to match Model Enum
    trekkingList.forEach((t, i) => allAdventures.push(buildAdventure(t, 'Trekking', i * 10)));
    waterList.forEach((t, i) => allAdventures.push(buildAdventure(t, 'Water', i * 20)));
    campingList.forEach((t, i) => allAdventures.push(buildAdventure(t, 'Camping', i * 30)));
    bikingList.forEach((t, i) => allAdventures.push(buildAdventure(t, 'Biking', i * 40)));

    return allAdventures;
}

const importData = async () => {
    try {
        await User.deleteMany();
        await Adventure.deleteMany();
        await Booking.deleteMany();

        console.log('Data Destroyed...'.red.inverse);

        const createdUsers = await User.create([
            { name: 'Admin User', email: 'admin@gmail.com', password: 'password123', role: 'admin' },
            { name: 'John Host', email: 'host@gmail.com', password: 'password123', role: 'host' },
            { name: 'Jane Traveler', email: 'user@gmail.com', password: 'password123', role: 'user' }
        ]);

        const hostId = createdUsers[1]._id;
        const adventures = generateAdventures(hostId);

        await Adventure.create(adventures);

        console.log(`Imported ${adventures.length} Smart-Image Adventures!`.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
