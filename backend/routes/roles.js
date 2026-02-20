const express = require('express');
const router = express.Router();
const { Role, RolePermission, User, AuditLog, sequelize } = require('../models');

// 1. Get All Roles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.findAll({
            include: [{ model: User, attributes: ['id', 'name'] }]
        });
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Create Role
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, description, permissions } = req.body;

        const role = await Role.create({ name, description }, { transaction: t });

        // Default modules and permissions as per requirement
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
                const isAllowed = permissions && permissions[mod] && permissions[mod][perm];
                rolePerms.push({
                    RoleId: role.id,
                    module: mod,
                    permission: perm,
                    isAllowed: !!isAllowed
                });
            });
        });

        await RolePermission.bulkCreate(rolePerms, { transaction: t });

        await AuditLog.create({
            action: 'CREATE_ROLE',
            performedBy: 'Admin', // In real app, get from req.user
            module: 'Role Management',
            details: `Created role: ${name}`
        }, { transaction: t });

        await t.commit();
        res.status(201).json(role);
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
});

// 3. Get Specific Role with Permissions Matrix
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id, {
            include: [RolePermission]
        });
        if (!role) return res.status(404).json({ error: 'Role not found' });

        // Transform into a matrix format for frontend
        const matrix = {};
        role.RolePermissions.forEach(p => {
            if (!matrix[p.module]) matrix[p.module] = {};
            matrix[p.module][p.permission] = p.isAllowed;
        });

        res.json({
            ...role.toJSON(),
            matrix
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Update Role & Permissions
router.put('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, description, status, matrix } = req.body;
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });

        await role.update({ name, description, status }, { transaction: t });

        if (matrix) {
            for (const moduleName of Object.keys(matrix)) {
                for (const permName of Object.keys(matrix[moduleName])) {
                    await RolePermission.update(
                        { isAllowed: matrix[moduleName][permName] },
                        {
                            where: { RoleId: role.id, module: moduleName, permission: permName },
                            transaction: t
                        }
                    );
                }
            }
        }

        await AuditLog.create({
            action: 'UPDATE_ROLE',
            performedBy: 'Admin',
            module: 'Role Management',
            details: `Updated role: ${name} permissions`
        }, { transaction: t });

        await t.commit();
        res.json({ message: 'Role updated successfully' });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
});

// 5. Get Role Members
router.get('/:id/members', async (req, res) => {
    try {
        const users = await User.findAll({
            where: { RoleId: req.params.id },
            attributes: ['id', 'name', 'email', 'role']
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Assign Role to User
router.post('/:id/assign', async (req, res) => {
    try {
        const { userIds } = req.body; // Array of user IDs
        await User.update(
            { RoleId: req.params.id },
            { where: { id: userIds } }
        );

        await AuditLog.create({
            action: 'ASSIGN_ROLE',
            performedBy: 'Admin',
            module: 'Role Management',
            details: `Assigned role ID ${req.params.id} to users: ${userIds.join(', ')}`
        });

        res.json({ message: 'Users assigned to role successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Get Audit Logs
router.get('/audit/logs', async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
