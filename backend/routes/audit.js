const express = require('express');
const router = express.Router();
const { AuditLog } = require('../models');

// Get All Audit Logs
router.get('/', async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
