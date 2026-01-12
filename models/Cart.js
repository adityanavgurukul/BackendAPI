const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    productID: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Please add a productID']
    },
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

// expose `id` (mapped from MongoDB `_id`) and hide `_id` + `__v` in JSON
cartSchema.virtual('id').get(function() {
    return this._id;
});

cartSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
