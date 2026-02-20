const express = require('express');
const router = express.Router();
const { Booking, AuditLog } = require('../models');

// GET all bookings
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        const whereClause = userId ? { userId } : {};
        const bookings = await Booking.findAll({ where: whereClause });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a booking
router.post('/', async (req, res) => {
    const { pickupLocation, dropLocation, goodsType, weight, userId } = req.body;

    if (!pickupLocation || !dropLocation || !goodsType || !weight || !userId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const booking = await Booking.create({
            pickupLocation,
            dropLocation,
            goodsType,
            weight,
            userId,
            estimatedCost: 100 * weight, // Mock calculation: 100 per ton/kg
        });

        await AuditLog.create({
            action: 'CREATE_BOOKING',
            performedBy: 'User', // Usually would be the requesting user
            module: 'Logistics Requests',
            details: `New request: ${pickupLocation} → ${dropLocation} for ${goodsType}`
        });

        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE booking status (e.g. Approved, Cancelled)
router.patch('/:id/status', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const { status } = req.body;
        if (['Pending', 'Approved', 'Rejected', 'Completed'].includes(status)) {
            const oldStatus = booking.status;
            await booking.update({ status });

            await AuditLog.create({
                action: 'UPDATE_BOOKING',
                performedBy: 'Admin',
                module: 'Logistics Requests',
                details: `Booking #${booking.id} moved from ${oldStatus} to ${status}`
            });

            res.json({ message: 'Status updated', booking });
        } else {
            res.status(400).json({ message: 'Invalid status' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
