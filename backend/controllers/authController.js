const jwt = require('jsonwebtoken');
const { User, Role, RolePermission } = require('../models');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            include: [{
                model: Role,
                include: [RolePermission]
            }]
        });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Transform permissions into a simpler matrix for the frontend
        const permissions = {};
        if (user.Role && user.Role.RolePermissions) {
            user.Role.RolePermissions.forEach(p => {
                if (!permissions[p.module]) permissions[p.module] = {};
                permissions[p.module][p.permission] = p.isAllowed;
            });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                roleName: user.Role ? user.Role.name : 'No Role',
                permissions
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.signup = async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    if (!email || !password || !role || !name) {
        return res.status(400).json({ message: 'All fields required' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({ name, email, password, role, phone });
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        return res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
