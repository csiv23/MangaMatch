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

module.exports = router;
