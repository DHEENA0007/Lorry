const express = require('express');
const router = express.Router();
const { VehicleFinance, Lorry } = require('../models');

// Get all finance records
router.get('/', async (req, res) => {
    try {
        const records = await VehicleFinance.findAll({
            include: [{ model: Lorry, attributes: ['vehicleNumber'] }]
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a finance record
router.post('/', async (req, res) => {
    try {
        const record = await VehicleFinance.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a finance record
router.put('/:id', async (req, res) => {
    try {
        const record = await VehicleFinance.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: 'Record not found' });
        await record.update(req.body);
        res.json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a finance record
router.delete('/:id', async (req, res) => {
    try {
        const record = await VehicleFinance.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: 'Record not found' });
        await record.destroy();
        res.json({ message: 'Record deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
