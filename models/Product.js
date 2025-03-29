const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.Mixed, required: false },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: 0
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    rating: {
        rate: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    }
}, { 
    _id: false, // Disable automatic _id generation
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
