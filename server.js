require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const Manga = require('./models/Manga');


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

app.get('/api/search-basic', async (req, res) => {
    try {
        let mangas = await Manga.find().limit(10).exec();
        console.log("Mangas fetched:", mangas);
        res.json(mangas);

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});


app.get('/api/search', async (req, res) => {
    const searchTerm = req.query.term;
    try {
        let mangas = await Manga.find({
            title: new RegExp(searchTerm, 'i')  // 'i' makes the search case-insensitive
        })
            .limit(10)  // limit to 10 results for quick suggestions
            .exec();

        res.json(mangas);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

