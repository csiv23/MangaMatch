// Route handlers for manga recommendations

const express = require('express');
const Manga = require('../models/Manga');
const parseGenres = require('../utils/parseGenres');

const router = express.Router();

// Post route to provide manga recommendations based on user's manga selection
router.post('/', async (req, res, next) => {
    const mangaIds = req.body.mangaIds;
    try {
        const mangas = await Manga.find({
            manga_id: { $in: mangaIds }
        }).exec();

        if (!mangas || mangas.length === 0) {
            return res.status(404).send('No manga found for given IDs.');
        }

        let genres = [];
        mangas.forEach(manga => {
            const parsedGenres = parseGenres(manga.genres);
            genres = genres.concat(parsedGenres);
        });

        genres = [...new Set(genres)];

        const regexPattern = new RegExp(genres.join("|"), 'i');

        const recommendedManga = await Manga.find({
            genres: { $regex: regexPattern },
            manga_id: { $nin: mangaIds }
        }).limit(10).exec();

        res.json(recommendedManga);

    } catch (err) {
        next(err);
    }
});

module.exports = router;
