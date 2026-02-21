const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false, // Set to true to see SQL queries
});

// Define Models

// --- User Model ---
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'driver', 'user'),
        defaultValue: 'user',
    },
    RoleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// --- Role Model ---
const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
});

// --- RolePermission Model ---
const RolePermission = sequelize.define('RolePermission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    module: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    permission: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAllowed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

// --- AuditLog Model ---
const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    performedBy: {
        type: DataTypes.STRING,
    },
    module: {
        type: DataTypes.STRING,
    },
    details: {
        type: DataTypes.TEXT,
    },
});

// --- Lorry Model ---
const Lorry = sequelize.define('Lorry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicleNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.STRING, // e.g., 'Container', 'Open', 'Tanker'
        allowNull: false,
    },
    capacity: {
        type: DataTypes.FLOAT, // in tons
        allowNull: true,
    },
    tires: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    batteries: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    loadedMileage: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    emptyMileage: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Available', 'On Trip', 'Maintenance', 'Inactive'),
        defaultValue: 'Available',
    },
    currentLocation: {
        type: DataTypes.STRING, // Could be lat,long or address string
        allowNull: true,
    },
});

// --- Trip Model ---
const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled'),
        defaultValue: 'Scheduled',
    },
    budget: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    expenses: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    podImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    podStatus: {
        type: DataTypes.ENUM('Pending', 'Verified', 'Rejected', 'None'),
        defaultValue: 'None',
    },
});

// --- Booking Model ---
const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dropLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    goodsType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Completed'),
        defaultValue: 'Pending',
    },
    estimatedCost: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

// --- Expense Model ---
const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING, // Fuel, Toll, Food, Maintenance, Other
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
    },
    proofUrl: {
        type: DataTypes.STRING, // URL to receipt image
        allowNull: true,
    },
});

// --- VehicleDocument Model ---
const VehicleDocument = sequelize.define('VehicleDocument', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    documentType: {
        type: DataTypes.STRING, // e.g., 'Registration Certificate (RC)', 'Insurance'
        allowNull: false,
    },
    documentNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
});

// --- VehicleFinance Model ---
const VehicleFinance = sequelize.define('VehicleFinance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    financeType: {
        type: DataTypes.STRING, // e.g., 'BODY', 'CHASSIS'
        allowNull: false,
    },
    financerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    loanAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    emiAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    emiStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    emiEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    totalEmis: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    emisPaid: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

// Define Relationships

// A Lorry can be assigned to a Trip
Lorry.hasMany(Trip, { foreignKey: 'lorryId' });
Trip.belongsTo(Lorry, { foreignKey: 'lorryId' });

// A Driver (User) can be assigned to a Trip
User.hasMany(Trip, { foreignKey: 'driverId' });
Trip.belongsTo(User, { as: 'Driver', foreignKey: 'driverId' });

// A User creates a Booking
User.hasMany(Booking);
Booking.belongsTo(User);

// A Trip can fulfill a Booking
Trip.hasOne(Booking);
Booking.belongsTo(Trip);

// A Trip has many Expenses
Trip.hasMany(Expense);
Expense.belongsTo(Trip);

// A Driver (User) creates Expenses
User.hasMany(Expense, { foreignKey: 'driverId' });
Expense.belongsTo(User, { as: 'Driver', foreignKey: 'driverId' });

// Lorry associations for Documents and Finance
Lorry.hasMany(VehicleDocument);
VehicleDocument.belongsTo(Lorry);

Lorry.hasMany(VehicleFinance);
VehicleFinance.belongsTo(Lorry);

// Role & Permission Relationships
Role.hasMany(User, { foreignKey: 'RoleId' });
User.belongsTo(Role, { foreignKey: 'RoleId' });

Role.hasMany(RolePermission);
RolePermission.belongsTo(Role);


module.exports = {
    sequelize,
    User,
    Lorry,
    Trip,
    Booking,
    Expense,
    VehicleDocument,
    VehicleFinance,
    Role,
    RolePermission,
    AuditLog,
};
