const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET users by role (optional query param)
router.get('/', async (req, res) => {
    try {
        const { role } = req.query;
        const whereClause = role ? { role } : {};
        const users = await User.findAll({
            where: whereClause,
            attributes: ['id', 'name', 'email', 'role', 'phone'] // Exclude password
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
