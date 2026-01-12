const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');

// GET /api/products - Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// GET /api/products/:id - Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        console.log(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
    try {
        const { title, price, description, category, image } = req.body;
        //Find the last item in products
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const product = await Product.create({
            id: lastProduct ? lastProduct.id + 1 : 1, // Increment the last product ID
            title, 
            price, 
            description, 
            category, 
            image,
            rating: { rate: 0, count: 0 }
        });

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// PUT /api/products/:id - Update a product by ID
router.put('/:id', async (req, res) => {
    try {
        const { title, price, description, category, image, favourite } = req.body;
        const product = await Product.findOneAndUpdate(
            {id: parseInt(req.params.id)}, 
            { 
                title, 
                price, 
                description, 
                category, 
                image, 
                favourite 
            }, 
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// DELETE /api/products/:id - Delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;
