// Route handlers for search functionality

const express = require('express');
const Manga = require('../models/Manga');

const router = express.Router();

// Basic search route that fetches the first 10 manga from the database
router.get('/basic', async (req, res, next) => {
    try {
        let mangaList = await Manga.find().limit(10).exec();
        res.json(mangaList);
    } catch (err) {
        next(err);
    }
});

// Search route that finds manga based on a provided search term
router.get('/', async (req, res, next) => {
    const searchTerm = req.query.term;
    try {
        let searchedManga = await Manga.find({
            title: new RegExp(searchTerm, 'i')
        }).limit(10).exec();

        res.json(searchedManga);
    } catch (err) {
        next(err);
    }
});

// Suggestions route that fetches partial matches for a given title
router.get('/suggestions', async (req, res, next) => {
    try {
        const { title, limit = 10 } = req.query;  // Add limit and set a default value
        if (!title) {
            return res.status(200).json([]); // Return an empty array if title is not provided
        }

        const regex = new RegExp(title, 'i'); // Case insensitive regex
        const regexManga = await Manga.find({
            $or: [
                { title: { $regex: regex } },
                { title_english: { $regex: regex } },
            ],
        }).limit(parseInt(limit, 10)); // Use parsed limit value here

        res.status(200).json(regexManga);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
