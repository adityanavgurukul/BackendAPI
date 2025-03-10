const router = require('express').Router();
const Todo = require('../models/Todo');
const verifyToken = require('../middleware/auth');

// Create todo
router.post('/', verifyToken, async (req, res) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            completed: req.body.completed,
            userId: req.user._id
        });
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all todos for a user
router.get('/', verifyToken, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user._id });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single todo
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update todo
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title || todo.title,
                description: req.body.description || todo.description,
                completed: req.body.completed !== undefined ? req.body.completed : todo.completed
            },
            { new: true }
        );
        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete todo
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
