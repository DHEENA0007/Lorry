const express = require('express');
const router = express.Router();
const { Expense, Trip, User } = require('../models');

// GET all expenses (or filter by Trip ID / Status / Driver)
router.get('/', async (req, res) => {
    try {
        const { status, tripId, driverId } = req.query;
        const where = {};
        if (status) where.status = status;
        if (tripId) where.TripId = tripId;
        if (driverId) where.driverId = driverId;

        const expenses = await Expense.findAll({
            where,
            include: [
                { model: Trip, attributes: ['id', 'source', 'destination', 'budget'] },
                { model: User, as: 'Driver', attributes: ['name', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// POST new expense (Driver submits expense)
router.post('/', async (req, res) => {
    try {
        const { amount, category, description, tripId, driverId, proofUrl } = req.body;
        // Basic validation
        if (!amount || !category || !tripId || !driverId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const expense = await Expense.create({
            amount,
            category,
            description,
            TripId: tripId,
            driverId,
            proofUrl,
            status: 'Pending'
        });

        // Optionally update total expenses in Trip model for quick access?
        // Or calculate dynamically. Let's update Trip for now to keep it simple.
        const trip = await Trip.findByPk(tripId);
        if (trip) {
            trip.expenses = (trip.expenses || 0) + parseFloat(amount);
            await trip.save();
        }

        res.status(201).json(expense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit expense' });
    }
});

// PUT update expense status (Approve/Reject)
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const expense = await Expense.findByPk(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        // If rejecting, maybe revert the amount from Trip total?
        // For simplicity, let's assume Trip.expenses tracks ALL submitted expenses regardless of status.
        // Or we can refine logic later.

        expense.status = status;
        await expense.save();
        res.json(expense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update expense' });
    }
});

module.exports = router;
