// Import necessary modules and configurations
const express = require('express');
const cors = require('cors');
const router = require('./router/userRouter');

const expenseRoute = require('./router/expenseRouter');
const cateRouter = require('./router/categoryRouter');
const debtRoute = require('./router/debtRouter');
require('./config/db'); // Connect to the database

// Create an instance of Express
const app = express();

// Middleware setup
app.use(cors()); // Use default CORS settings or configure as needed
app.use(express.json()); // Parse JSON request bodies

// Static file serving
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/v1', router);
app.use('/api/v1/category',cateRouter)
app.use('/api/v1/expenses',expenseRoute)
app.use('/api/v1/debt',debtRoute)


// Define the port
const PORT = process.env.PORT || 2090;

// Start the server
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});