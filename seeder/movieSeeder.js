const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Movie = require('../models/Movie');

const seedMovies = async () => {
    try {
        // Clear existing movies
        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        // Read movies from JSON file
        const moviesData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf-8')
        );

        // Insert movies
        const movies = await Movie.insertMany(moviesData);
        console.log(`${movies.length} movies seeded successfully`);

        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding movies:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedMovies();
