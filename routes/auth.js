const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// Register route
router.post('/register', async (req, res) => {
    try {
        // Validate input
        console.log(req.body)
        if (!req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user already exists
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = new User({
            username: req.body.username.trim(),
            email: req.body.email.toLowerCase().trim(),
            password: hashedPassword
        });

        // Save user to database
        const savedUser = await user.save();
        res.status(201).json({ 
            message: 'User created successfully',
            userId: savedUser._id 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Email or password is incorrect' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Email or password is incorrect' });
        }

        // Create and assign token
        const token = jwt.sign(
            { _id: user._id }, 
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Validate token route
router.get('/validate', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            isValid: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;