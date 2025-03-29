const mongoose = require('mongoose');
require('dotenv').config();
const productData = require('./products.json')

// MongoDB connection options with increased timeout
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
};

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
        console.log('Connected to MongoDB');

        const Product = require('../models/Product'); // Adjust path as needed
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('Products cleared');

        // Log the first product for debugging
        console.log('Sample product data:', productData[0]);

        // Insert without modifying the data
        await Product.insertMany(productData, { ordered: false });
        console.log('Products seeded successfully');

    } catch (error) {
        console.error('Error seeding data:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation error for ${key}:`, error.errors[key].message);
            });
        }
    } finally {
        // Always close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

seedProducts();
