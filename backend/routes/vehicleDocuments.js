const express = require('express');
const router = express.Router();
const { VehicleDocument, Lorry } = require('../models');

// Get all documents
router.get('/', async (req, res) => {
    try {
        const docs = await VehicleDocument.findAll({
            include: [{ model: Lorry, attributes: ['vehicleNumber'] }]
        });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a document
router.post('/', async (req, res) => {
    try {
        const doc = await VehicleDocument.create(req.body);
        res.status(201).json(doc);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a document
router.put('/:id', async (req, res) => {
    try {
        const doc = await VehicleDocument.findByPk(req.params.id);
        if (!doc) return res.status(404).json({ error: 'Document not found' });
        await doc.update(req.body);
        res.json(doc);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a document
router.delete('/:id', async (req, res) => {
    try {
        const doc = await VehicleDocument.findByPk(req.params.id);
        if (!doc) return res.status(404).json({ error: 'Document not found' });
        await doc.destroy();
        res.json({ message: 'Document deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
