require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MangaMatch'; 

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/api/recommendations', (req, res) => {
    // Get user input from req.query or req.body
    // Use your recommendation algorithm to fetch manga
    // Return the recommended manga
    res.json(recommendedManga);
});

app.get('/api/search', (req, res) => {
    const searchTerm = req.query.term; // assuming search term is passed as a query parameter
    // Search your MongoDB database for manga titles/authors/etc. that match the searchTerm
    // Return the search results
    res.json(searchResults);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

