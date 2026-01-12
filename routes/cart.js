const router = require('express').Router();
const Cart = require('../models/Cart');

// Create cart item
router.post('/', async (req, res) => {
    try {
        const { title, productID, quantity, price } = req.body;
        const item = new Cart({ title, productID, quantity, price });
        const saved = await item.save();
        res.status(201).json(saved);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages });
        }
        res.status(500).json({ message: error.message });
    }
});

// Get all cart items
router.get('/', async (req, res) => {
    try {
        const items = await Cart.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single cart item
router.get('/:id', async (req, res) => {
    try {
        const item = await Cart.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Cart item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update cart item
router.put('/:id', async (req, res) => {
    try {
        const item = await Cart.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Cart item not found' });

        const updated = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name ?? item.name,
                productID: req.body.productID ?? item.productID,
                quantity: req.body.quantity ?? item.quantity,
                price: req.body.price ?? item.price
            },
            { new: true, runValidators: true }
        );

        res.json(updated);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages });
        }
        res.status(500).json({ message: error.message });
    }
});

// Delete cart item
router.delete('/:id', async (req, res) => {
    try {
        const item = await Cart.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Cart item not found' });
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
