// Route handlers for search functionality

const express = require('express');
const Manga = require('../models/Manga');

const router = express.Router();

// Basic search route that fetches the first 10 manga from the database
router.get('/basic', async (req, res, next) => {
    try {
        let mangas = await Manga.find().limit(10).exec();
        res.json(mangas);
    } catch (err) {
        next(err);
    }
});

// Search route that finds manga based on a provided search term
router.get('/', async (req, res, next) => {
    const searchTerm = req.query.term;
    try {
        let mangas = await Manga.find({
            title: new RegExp(searchTerm, 'i')
        }).limit(10).exec();

        res.json(mangas);
    } catch (err) {
        next(err);
    }
});

// Suggestions route that fetches partial matches for a given title
router.get('/suggestions', async (req, res, next) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).send('Title query parameter is required');
        }

        const regex = new RegExp(title, 'i'); // Case insensitive regex
        const mangas = await Manga.find({
            $or: [
                { title: { $regex: regex } },
                { title_english: { $regex: regex } },
            ],
        }).limit(5); // Adjust the limit as needed

        res.status(200).json(mangas);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

module.exports = router;
