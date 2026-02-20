const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models'); // Import sequelize instance
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const lorryRoutes = require('./routes/lorries');
const tripRoutes = require('./routes/trips');
const dashboardRoutes = require('./routes/dashboard');
const bookingRoutes = require('./routes/bookings');
const expenseRoutes = require('./routes/expenses');
const financialRoutes = require('./routes/financials');
const vehicleDocumentRoutes = require('./routes/vehicleDocuments');
const vehicleFinanceRoutes = require('./routes/vehicleFinance');

const analyticsRoutes = require('./routes/analytics');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lorries', lorryRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
const roleRoutes = require('./routes/roles');

app.use('/api/roles', roleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/vehicle-documents', vehicleDocumentRoutes);
app.use('/api/vehicle-finance', vehicleFinanceRoutes);
app.use('/api/analytics', analyticsRoutes);
const auditRoutes = require('./routes/audit');
app.use('/api/audit', auditRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Yoyo Transport API is running with SQLite');
});

// Sync Database and Start Server
// force: false ensures tables are not dropped on restart 
// (use force: true during dev to reset DB if schema changes drastically)
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
