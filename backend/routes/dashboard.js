const express = require('express');
const router = express.Router();
const { Trip, Lorry, User, Booking, Expense, VehicleDocument, VehicleFinance, sequelize } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Handling FY (Financial Year) start - April 1st
        let fyStart;
        if (now.getMonth() >= 3) { // April or later
            fyStart = new Date(now.getFullYear(), 3, 1);
        } else {
            fyStart = new Date(now.getFullYear() - 1, 3, 1);
        }

        // 1. Operations Overview
        const tripsFYTD = await Trip.count({
            where: { createdAt: { [Op.gte]: fyStart } }
        });
        const tripsMTD = await Trip.count({
            where: { createdAt: { [Op.gte]: firstDayOfMonth } }
        });
        const pendingUnload = await Trip.count({
            where: { status: 'In Progress' }
        });
        const pendingPOD = await Trip.count({
            where: {
                status: 'Completed',
                podStatus: { [Op.or]: ['None', 'Pending'] }
            }
        });
        const pendingSettlement = await Trip.count({
            where: {
                status: 'Completed',
                podStatus: 'Verified'
                // Assuming verified POD starts settlement
            }
        });

        // 2. Vehicle Status
        const availableVehicles = await Lorry.count({ where: { status: 'Available' } });
        const busyVehicles = await Lorry.count({ where: { status: 'Busy' } });
        const idleVehicles = await Lorry.count({ where: { status: 'Idle' } });
        const maintenanceVehicles = await Lorry.count({ where: { status: 'Maintenance' } });

        // 3. Driver Status
        const driversTotal = await User.count({ where: { role: 'driver' } });
        const driversWorking = await Trip.count({
            where: { status: 'In Progress' },
            distinct: true,
            col: 'driverId'
        });

        // 4. Revenue & Expenses
        const revMTDRes = await Trip.sum('budget', {
            where: {
                status: 'Completed',
                endDate: { [Op.gte]: firstDayOfMonth }
            }
        }) || 0;

        const expMTDRes = await Trip.sum('expenses', {
            where: {
                status: 'Completed',
                endDate: { [Op.gte]: firstDayOfMonth }
            }
        }) || 0;

        const revFYRes = await Trip.sum('budget', {
            where: {
                status: 'Completed',
                endDate: { [Op.gte]: fyStart }
            }
        }) || 0;

        const expFYRes = await Trip.sum('expenses', {
            where: {
                status: 'Completed',
                endDate: { [Op.gte]: fyStart }
            }
        }) || 0;

        // 5. Recent Trips for Table
        const recentTrips = await Trip.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'Driver', attributes: ['name'] },
                { model: Lorry, attributes: ['vehicleNumber'] }
            ]
        });

        // 6. Maintenance Alerts (Dynamic from Lorry status for now)
        const maintenanceMetrics = {
            overdueMaintenance: await Lorry.count({ where: { status: 'Maintenance' } }), // Mapping maintenance status as alert
            dueMaintenance: 0,
            delayedMaintenance: 0
        };

        // 7. Receivables & Payables (Dynamic from Trips and Expenses)
        const receivables = await Trip.sum('budget', { where: { status: 'Completed' } }) || 0;
        const payables = await Expense.sum('amount', { where: { status: 'Pending' } }) || 0;

        // 8. EMI Overdue Logic
        // Simple logic: If today > emiStartDate + (emisPaid months), it's overdue
        const finances = await VehicleFinance.findAll();
        let totalEmiOverdue = 0;
        finances.forEach(f => {
            if (f.emisPaid < f.totalEmis) {
                const startDate = new Date(f.emiStartDate);
                const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
                if (monthsElapsed > f.emisPaid) {
                    const monthsOverdue = monthsElapsed - f.emisPaid;
                    totalEmiOverdue += (monthsOverdue * f.emiAmount);
                }
            }
        });

        // 9. Monthly Profit Graph Data
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear().toString().substr(-2);

            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

            const rev = await Trip.sum('budget', { where: { status: 'Completed', endDate: { [Op.between]: [start, end] } } }) || 0;
            const exp = await Trip.sum('expenses', { where: { status: 'Completed', endDate: { [Op.between]: [start, end] } } }) || 0;

            last6Months.push({ name: monthName, profit: rev - exp });
        }

        // Combined result
        res.json({
            metrics: {
                tripsFYTD,
                tripsMTD,
                pendingUnload,
                pendingPOD,
                pendingSettlement,
                ewayExpired: 0,

                availableVehicles,
                busyVehicles,
                idleVehicles,
                maintenanceVehicles,

                ...maintenanceMetrics,

                revenueMTD: revMTDRes,
                expensesMTD: expMTDRes,
                revenueFY: revFYRes,
                expensesFY: expFYRes,
                receivables,
                payables,

                emiDue: await VehicleFinance.sum('emiAmount', { where: { emisPaid: { [Op.lt]: sequelize.col('totalEmis') } } }) || 0,
                emiOverdue: totalEmiOverdue,

                driversTotal,
                driversWorking,
                driversVacation: Math.max(0, driversTotal - driversWorking),

                docsDueMonth: await VehicleDocument.count({
                    where: {
                        expiryDate: {
                            [Op.and]: [
                                { [Op.gte]: firstDayOfMonth },
                                { [Op.lte]: new Date(now.getFullYear(), now.getMonth() + 1, 0) }
                            ]
                        }
                    }
                }),
                docsDueNext: await VehicleDocument.count({
                    where: {
                        expiryDate: {
                            [Op.and]: [
                                { [Op.gt]: new Date(now.getFullYear(), now.getMonth() + 1, 0) },
                                { [Op.lte]: new Date(now.getFullYear(), now.getMonth() + 2, 0) }
                            ]
                        }
                    }
                }),
                docsExpired: await VehicleDocument.count({
                    where: {
                        expiryDate: { [Op.lt]: now }
                    }
                })
            },
            recentActivity: recentTrips,
            charts: {
                monthlyProfit: last6Months
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

module.exports = router;
