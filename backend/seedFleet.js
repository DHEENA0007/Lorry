const { sequelize, Lorry, VehicleDocument, VehicleFinance } = require('./models');

async function seedFleet() {
    try {
        await sequelize.sync({ force: false });
        console.log('Database synced for Fleet seeding.');

        // 1. Create Vehicles (if they don't exist)
        const v1 = await Lorry.findOrCreate({
            where: { vehicleNumber: 'TN65BT0184' },
            defaults: { type: 'Chassis', capacity: 16, status: 'Available' }
        });
        const v2 = await Lorry.findOrCreate({
            where: { vehicleNumber: 'TN65CZ0398' },
            defaults: { type: 'Truck', capacity: 12, status: 'On Trip' }
        });
        const v3 = await Lorry.findOrCreate({
            where: { vehicleNumber: 'TN65BU5395' },
            defaults: { type: 'Truck', capacity: 10, status: 'Maintenance' }
        });

        const lorries = [v1[0], v2[0], v3[0]];

        // 2. Create Documents
        const docs = [
            {
                LorryId: lorries[0].id,
                documentType: 'Registration Certificate (RC)',
                documentNumber: 'TN65BT0184',
                issueDate: '2025-01-02',
                expiryDate: '2040-01-02'
            },
            {
                LorryId: lorries[1].id,
                documentType: 'Insurance',
                documentNumber: 'INS-88273',
                issueDate: '2025-01-01',
                expiryDate: '2026-01-01'
            },
            {
                LorryId: lorries[0].id,
                documentType: 'Fitness Certificate',
                documentNumber: 'FC-99128',
                issueDate: '2025-05-10',
                expiryDate: '2026-02-10'
            },
            {
                LorryId: lorries[2].id,
                documentType: 'Permit',
                documentNumber: 'P-55261',
                issueDate: '2025-06-15',
                expiryDate: '2026-06-15'
            }
        ];

        for (const doc of docs) {
            await VehicleDocument.findOrCreate({
                where: { documentNumber: doc.documentNumber },
                defaults: doc
            });
        }

        // 3. Create Finance Records
        const finance = [
            {
                LorryId: lorries[0].id,
                financeType: 'BODY',
                financerName: 'SHRIRAM FINANCE',
                loanAmount: 2200000,
                emiAmount: 52800,
                emiStartDate: '2025-01-10',
                emiEndDate: '2028-12-10',
                totalEmis: 48,
                emisPaid: 2
            }
        ];

        for (const f of finance) {
            await VehicleFinance.findOrCreate({
                where: { LorryId: f.LorryId, financeType: f.financeType },
                defaults: f
            });
        }

        console.log('--- FLEET DATA SEEDED ---');

    } catch (err) {
        console.error('Fleet seeding failed:', err);
    } finally {
        await sequelize.close();
    }
}

seedFleet();
