const express = require('express');
const router = express.Router();
const { Trip, Expense, User, sequelize } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        // 1. Revenue & Expenses over last 6 months
        // SQLite date queries can be tricky. We fetch all recent data and process in JS for simplicity in this demo.
        const trips = await Trip.findAll({
            where: {
                status: 'Completed',
                endDate: {
                    [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6))
                }
            },
            attributes: ['endDate', 'budget', 'expenses']
        });

        const chartDataMap = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        trips.forEach(t => {
            if (t.endDate) {
                const date = new Date(t.endDate);
                const monthName = months[date.getMonth()];

                if (!chartDataMap[monthName]) {
                    chartDataMap[monthName] = { name: monthName, revenue: 0, expenses: 0 };
                }
                chartDataMap[monthName].revenue += t.budget || 0;
                chartDataMap[monthName].expenses += t.expenses || 0;
            }
        });

        const chartData = Object.values(chartDataMap);

        // 2. Driver Performance
        // Count trips per driver
        const drivers = await User.findAll({
            where: { role: 'driver' },
            include: [{ model: Trip, attributes: ['id', 'status'] }]
        });

        const driverPerformance = drivers.map(d => {
            const completed = d.Trips.filter(t => t.status === 'Completed').length;
            const efficiency = Math.floor(Math.random() * (100 - 70 + 1) + 70); // Mock efficiency score for now
            return {
                name: d.name.split(' ')[0], // First name only for chart brevity
                trips: completed,
                efficiency: efficiency
            };
        }).sort((a, b) => b.trips - a.trips).slice(0, 5); // Top 5

        // 3. KPI Cards
        const totalTrips = trips.length;
        const totalCost = trips.reduce((acc, t) => acc + (t.expenses || 0), 0);
        // Mock distance for KM calc -> Assume 500KM avg per trip
        const totalKM = totalTrips * 500;
        const avgCostPerKM = totalKM > 0 ? (totalCost / totalKM).toFixed(2) : 0;

        res.json({
            revenueChart: chartData.length ? chartData : [{ name: 'No Data', revenue: 0, expenses: 0 }],
            driverPerformance,
            kpi: {
                avgCostPerKM,
                onTime: '94.2%', // Mock value
                utilization: '78%' // Mock value
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
