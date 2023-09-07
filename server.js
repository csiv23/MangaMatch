// server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const dbConnection = require('./utils/dbConnection');
const recommendationsRouter = require('./routes/recommendations');
const suggestionsRouter = require('./routes/suggestions'); 
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/api/test', (req, res) => {
    console.log('Test route accessed');
    res.status(200).send({ message: 'Test successful' });
});

app.get('/api/recommend/debug/:mangaId', (req, res) => {
    console.log(`Debug route for mangaId: ${req.params.mangaId}`);
    res.status(200).send({ message: 'Debug route hit' });
});

app.use('/api/recommend', recommendationsRouter);
app.use('/api/search', searchRoutes);
app.use('/api/suggestions', suggestionsRouter); // Use the new route


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
dbConnection().then(async () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});