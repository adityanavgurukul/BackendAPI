const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    _id: { type: mongoose.Schema.Types.Mixed, required: false },
    quantity: {
        type: Number,
        required: [true, 'Please add a quantity'],
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price must be >= 0']
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
