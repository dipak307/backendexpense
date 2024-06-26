const express = require("express");
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

if (!PORT) {
    console.error('PORT environment variable is not defined');
    process.exit(1); // Exit the process with an error code
}

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // React frontend URL
    methods: ['POST', 'GET', 'DELETE'], // Added DELETE method
    credentials: true,
}));

// Absolute path to the routes directory
const routesPath = path.resolve(__dirname, 'routes');

// Debugging the path
console.log(`Routes directory path: ${routesPath}`);

// Check if the directory exists
const fs = require('fs');
if (!fs.existsSync(routesPath)) {
    console.error('Routes directory does not exist');
    process.exit(1);
}

// Routes
readdirSync(routesPath).forEach(route => {
    app.use('/api/v1', require(path.join(routesPath, route)));
});

// Test route
app.get('/', (req, res) => {
    res.send("Hello world");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const startServer = async () => {
    try {
        await db(); // Ensure the database connection is established before starting the server
        app.listen(PORT, () => {
            console.log('Listening to port:', PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit the process with an error code
    }
};

startServer();
