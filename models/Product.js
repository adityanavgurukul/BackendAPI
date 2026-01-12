const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.Mixed, required: false },
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
    },
    favourite: {
        type: Boolean,
        default: false
    }
}, {
    _id: false, // Disable automatic _id generation (we use `id` instead)
    timestamps: true,
    toJSON: {
        virtuals: false,
        transform(doc, ret) {
            // ensure `id` is present and remove internal fields if any
            if (ret.id === undefined && ret._id !== undefined) ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

module.exports = mongoose.model('Product', productSchema);
