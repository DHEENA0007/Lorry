const { Role, RolePermission, User, sequelize } = require('./models');

const seedRoles = async () => {
    try {
        await sequelize.sync();

        // 1. Create Super Admin Role
        const [superAdminRole] = await Role.findOrCreate({
            where: { name: 'Super Admin' },
            defaults: { description: 'Complete system access with all permissions.' }
        });

        const modules = [
            'Dashboard Access', 'Lorry Management', 'Driver Management',
            'Booking Management', 'Trip Scheduling', 'Expense & Budget Review',
            'Financial Reports', 'Analytics & Reports', 'System Settings',
            'Notification Management'
        ];
        const permissionTypes = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Assign', 'Export'];

        const rolePerms = [];
        modules.forEach(mod => {
            permissionTypes.forEach(perm => {
                rolePerms.push({
                    RoleId: superAdminRole.id,
                    module: mod,
                    permission: perm,
                    isAllowed: true
                });
            });
        });

        // Clear existing permissions for this role and re-add to ensure completeness
        await RolePermission.destroy({ where: { RoleId: superAdminRole.id } });
        await RolePermission.bulkCreate(rolePerms);

        // 2. Create or Update Admin user
        const [adminUser] = await User.findOrCreate({
            where: { email: 'admin@yoyo.com' },
            defaults: {
                name: 'Super Admin',
                password: 'admin', // Default password
                role: 'admin',
                phone: '1234567890'
            }
        });

        await adminUser.update({ RoleId: superAdminRole.id, role: 'admin' });
        console.log('Super Admin role assigned to admin@yoyo.com');

        console.log('Roles and Permissions seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding roles:', err);
        process.exit(1);
    }
};

seedRoles();
