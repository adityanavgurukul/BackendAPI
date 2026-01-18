const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.Mixed, required: false },
    title: {
        type: String,
        required: [true, 'Please add a movie title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a movie description']
    },
    genre: {
        type: String,
        required: [true, 'Please add a genre']
    },
    releaseYear: {
        type: Number,
        required: [true, 'Please add a release year']
    },
    director: {
        type: String,
        required: [true, 'Please add director name']
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    posterUrl: {
        type: String,
        required: [true, 'Please add a poster URL']
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    _id: false,
    timestamps: true,
    toJSON: {
        virtuals: false,
        transform(doc, ret) {
            if (ret.id === undefined && ret._id !== undefined) ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

module.exports = mongoose.model('Movie', movieSchema);
