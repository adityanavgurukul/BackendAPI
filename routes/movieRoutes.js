const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const verifyToken = require('../middleware/auth');

// GET /api/movies - Get all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        
        res.status(200).json({
            success: true,
            count: movies.length,
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// GET /api/movies/:id - Get a single movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findOne({ id: parseInt(req.params.id) });
        if (!movie) {
            return res.status(404).json({
                success: false,
                error: 'Movie not found'
            });
        }

        res.status(200).json({
            success: true,
            data: movie
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid movie ID format'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// GET /api/movies/favorites/list - Get all favorite movies
router.get('/favorites/list', async (req, res) => {
    try {
        const favoriteMovies = await Movie.find({ isFavorite: true });
        
        res.status(200).json({
            success: true,
            count: favoriteMovies.length,
            data: favoriteMovies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// POST /api/movies - Create a new movie
router.post('/', async (req, res) => {
    try {
        const { title, description, genre, releaseYear, director, rating, posterUrl } = req.body;
        
        // Find the last movie in the database
        const lastMovie = await Movie.findOne().sort({ id: -1 });
        
        const movie = await Movie.create({
            id: lastMovie ? lastMovie.id + 1 : 1, // Increment the last movie ID
            title,
            description,
            genre,
            releaseYear,
            director,
            rating,
            posterUrl,
            isFavorite: false
        });

        res.status(201).json({
            success: true,
            data: movie
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

// PUT /api/movies/:id - Update a movie by ID
router.put('/:id', async (req, res) => {
    try {
        const { title, description, genre, releaseYear, director, rating, posterUrl } = req.body;
        const movie = await Movie.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            {
                title,
                description,
                genre,
                releaseYear,
                director,
                rating,
                posterUrl
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                error: 'Movie not found'
            });
        }

        res.status(200).json({
            success: true,
            data: movie
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
                error: 'Invalid movie ID format'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// PUT /api/movies/:id/favorite - Mark a movie as favorite or unfavorite
router.put('/:id/favorite', async (req, res) => {
    try {
        const { isFavorite } = req.body;
        
        const movie = await Movie.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            { isFavorite },
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                error: 'Movie not found'
            });
        }

        res.status(200).json({
            success: true,
            message: isFavorite ? 'Movie added to favorites' : 'Movie removed from favorites',
            data: movie
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid movie ID format'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// DELETE /api/movies/:id - Delete a movie by ID
router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!movie) {
            return res.status(404).json({
                success: false,
                error: 'Movie not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid movie ID format'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;
