// server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const dbConnection = require('./utils/dbConnection');
const recommendationsRouter = require('./routes/recommendations'); // Ensure the path is correct
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Logging Middleware: Logs incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

// Test route for basic checking
app.get('/api/test', (req, res) => {
    console.log('Test route accessed');
    res.status(200).send({ message: 'Test successful' });
});

// Debug Test Route: To isolate issue in the recommendations route
app.get('/api/recommend/debug/:mangaId', (req, res) => {
    console.log(`Debug route for mangaId: ${req.params.mangaId}`);
    res.status(200).send({ message: 'Debug route hit' });
});

// Main Route Definitions
app.use('/api/recommend', recommendationsRouter);
app.use('/api/search', searchRoutes);

// Central Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
