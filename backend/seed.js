const { sequelize, User } = require('./models');

async function seed() {
    try {
        // Sync database (this might clear existing data if force: true is used, be careful in prod)
        // Using force: false to keep existing data if any, or force: true to reset. 
        // User asked for "just superadmin", implying a setup script. I'll use force: false to be safe, 
        // but check if admin exists first.

        await sequelize.sync({ force: false });
        console.log('Database synced.');

        const adminEmail = 'admin@yoyo.com';

        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Super Admin already exists.');
            return;
        }

        const admin = await User.create({
            name: 'Super Admin',
            email: adminEmail,
            password: 'admin', // In production, use hashed passwords!
            role: 'admin',
            phone: '1234567890'
        });

        console.log('--- SUPER ADMIN CREATED ---');
        console.log('Email: admin@yoyo.com');
        console.log('Password: admin');
        console.log('Role: admin');

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await sequelize.close();
    }
}

seed();
