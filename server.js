// Import required packages and modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// Import utility for database connection and routes
const dbConnection = require('./utils/dbConnection');
const searchRoutes = require('./routes/search');
const recommendationRoutes = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Route definitions
app.use('/api/search', searchRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Central error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server after connecting to the database
dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
