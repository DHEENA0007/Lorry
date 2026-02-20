const express = require('express');
const router = express.Router();
const { Trip, Lorry, User, Booking, AuditLog } = require('../models');  // Import related models too

// GET all trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.findAll({
            include: [
                { model: Lorry, attributes: ['vehicleNumber'] },
                { model: User, as: 'Driver', attributes: ['name', 'phone'] },
                { model: Booking, attributes: ['goodsType', 'estimatedCost'] }
            ]
        });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET trip by ID
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id, {
            include: [
                { model: Lorry },
                { model: User, as: 'Driver' },
                { model: Booking }
            ]
        });
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a new trip (Assign driver and lorry)
router.post('/', async (req, res) => {
    const { driverId, lorryId, source, destination, budget, startDate } = req.body;
    try {
        const newTrip = await Trip.create({
            driverId,
            lorryId,
            source,
            destination,
            budget,
            startDate: startDate || new Date(),
            status: 'Scheduled',
        });

        // Update lorry status
        const lorry = await Lorry.findByPk(lorryId);
        if (lorry) await lorry.update({ status: 'On Trip' });

        await AuditLog.create({
            action: 'CREATE_TRIP',
            performedBy: 'Admin',
            module: 'Trip Operations',
            details: `Dispatch initiated: ${source} to ${destination} (Budget: ₹${budget})`
        });

        res.status(201).json(newTrip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE Trip Status / Complete Trip
router.put('/:id', async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        const { status, expenses, endDate } = req.body;

        const updates = {};
        if (status) updates.status = status;
        if (expenses !== undefined) updates.expenses = expenses;
        if (endDate) updates.endDate = endDate;
        if (req.body.podStatus) updates.podStatus = req.body.podStatus;
        if (req.body.podImageUrl) updates.podImageUrl = req.body.podImageUrl;

        await trip.update(updates);

        // If trip completed, free the lorry
        if (status === 'Completed' || status === 'Cancelled') {
            const lorry = await Lorry.findByPk(trip.lorryId);
            if (lorry) await lorry.update({ status: 'Available' });
        }

        await AuditLog.create({
            action: 'UPDATE_TRIP',
            performedBy: 'Admin',
            module: 'Trip Operations',
            details: `Trip #${trip.id} status updated to: ${status || 'Modified'}`
        });

        res.json(trip);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
