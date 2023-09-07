// ./routes/suggestions.js
const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');

router.get('/partial', async (req, res, next) => {
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
