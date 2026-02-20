const express = require('express');
const router = express.Router();
const { Trip, Expense, sequelize } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        // 1. Total Revenue (Sum of 'budget' from completed trips)
        const completedTrips = await Trip.findAll({
            where: { status: 'Completed' },
            attributes: ['id', 'budget', 'expenses', 'endDate']
        });

        const totalRevenue = completedTrips.reduce((acc, t) => acc + (t.budget || 0), 0);
        const totalExpenses = completedTrips.reduce((acc, t) => acc + (t.expenses || 0), 0);
        const netProfit = totalRevenue - totalExpenses;

        // 2. Trend Logic (Last 6 Months)
        const now = new Date();
        const monthlyData = {};
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mLabel = d.toLocaleString('default', { month: 'short' });
            monthlyData[mLabel] = 0;
        }

        completedTrips.forEach(t => {
            if (t.endDate) {
                const month = new Date(t.endDate).toLocaleString('default', { month: 'short' });
                if (monthlyData.hasOwnProperty(month)) {
                    monthlyData[month] += t.budget;
                }
            }
        });

        // 3. Cost Distribution (Dynamic from Expenses categories)
        const expenseStats = await Expense.findAll({
            where: { status: 'Approved' },
            attributes: [
                'category',
                [sequelize.fn('SUM', sequelize.col('amount')), 'total']
            ],
            group: ['category']
        });

        const costDistribution = {};
        expenseStats.forEach(stat => {
            costDistribution[stat.category] = parseFloat(stat.get('total')) || 0;
        });

        // 4. Ledger (Mixed Transactions)
        const recentExpenses = await Expense.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [{ model: sequelize.models.User, as: 'Driver', attributes: ['name'] }]
        });

        const transactions = [];

        // Revenue Entries
        completedTrips.slice(-10).forEach(t => {
            transactions.push({
                id: `REV-${t.id}`,
                date: t.endDate,
                desc: `Freight Revenue - Trip #${t.id}`,
                amount: t.budget,
                type: 'credit'
            });
        });

        // Expense Entries
        recentExpenses.forEach(e => {
            transactions.push({
                id: `EXP-${e.id}`,
                date: e.createdAt,
                desc: `${e.category} - ${e.description || 'Fleet Expense'}`,
                amount: e.amount,
                type: 'debit'
            });
        });

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            summary: {
                totalRevenue,
                totalExpenses,
                netProfit,
                margin: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0
            },
            monthlyData,
            costDistribution,
            transactions: transactions.slice(0, 15)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch financials' });
    }
});

module.exports = router;
