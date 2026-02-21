const express = require('express');
const router = express.Router();
const { Lorry, AuditLog, Trip, User } = require('../models');

// GET all lorries
router.get('/', async (req, res) => {
    try {
        const lorries = await Lorry.findAll({
            include: [{
                model: Trip,
                required: false,
                include: [{
                    model: User,
                    as: 'Driver',
                    attributes: ['name', 'phone']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        const formattedLorries = lorries.map(lorry => {
            const lorryJSON = lorry.toJSON();
            // Find an active trip (In Progress or Scheduled)
            const activeTrip = lorryJSON.Trips?.find(t => t.status === 'In Progress' || t.status === 'Scheduled');

            return {
                ...lorryJSON,
                activeDriver: activeTrip?.Driver || null,
            };
        });

        res.json(formattedLorries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a new lorry
router.post('/', async (req, res) => {
    const { vehicleNumber, type, capacity, status, tires, batteries, loadedMileage, emptyMileage } = req.body;
    try {
        const newLorry = await Lorry.create({
            vehicleNumber,
            type,
            capacity,
            status: status || 'Available',
            tires,
            batteries,
            loadedMileage,
            emptyMileage
        });

        await AuditLog.create({
            action: 'CREATE_VEHICLE',
            performedBy: 'Admin',
            module: 'Fleet Management',
            details: `Enrolled new vehicle: ${vehicleNumber} (${type})`
        });

        res.status(201).json(newLorry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a lorry
router.put('/:id', async (req, res) => {
    try {
        const lorry = await Lorry.findByPk(req.params.id);
        if (!lorry) return res.status(404).json({ message: 'Lorry not found' });

        const { vehicleNumber, type, capacity, status, currentLocation, tires, batteries, loadedMileage, emptyMileage } = req.body;
        await lorry.update({
            vehicleNumber,
            type,
            capacity,
            status,
            currentLocation,
            tires,
            batteries,
            loadedMileage,
            emptyMileage
        });

        await AuditLog.create({
            action: 'UPDATE_VEHICLE',
            performedBy: 'Admin',
            module: 'Fleet Management',
            details: `Updated vehicle registry: ${lorry.vehicleNumber}`
        });

        res.json(lorry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST update lorry physical location (from driver app)
router.post('/:id/location', async (req, res) => {
    try {
        const lorry = await Lorry.findByPk(req.params.id);
        if (!lorry) return res.status(404).json({ message: 'Lorry not found' });

        await lorry.update({ currentLocation: req.body.location }); // format "lat,lng"
        res.json({ success: true, currentLocation: lorry.currentLocation });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a lorry
router.delete('/:id', async (req, res) => {
    try {
        const lorry = await Lorry.findByPk(req.params.id);
        if (!lorry) return res.status(404).json({ message: 'Lorry not found' });

        const vNum = lorry.vehicleNumber;
        await lorry.destroy();

        await AuditLog.create({
            action: 'DELETE_VEHICLE',
            performedBy: 'Admin',
            module: 'Fleet Management',
            details: `Decommissioned vehicle: ${vNum}`
        });

        res.json({ message: 'Lorry deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
