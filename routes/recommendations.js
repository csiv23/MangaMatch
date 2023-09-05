// recommendations.js

const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');  
const { correctJsonString, parseAuthorsString, safeParseJSON } = require('../utils/jsonHelper');

router.get('/:mangaId', async (req, res) => {
    try {
        console.log(`Recommend route for mangaId: ${req.params.mangaId}`);
        
        const manga = await Manga.findOne({ manga_id: req.params.mangaId });
        console.log(manga);

        const correctedMangaInfo = correctJsonString(JSON.stringify(manga));

        // Format the authors array
        const formattedAuthors = manga.authors.map(author => ({
            id: author.id,
            first_name: author.first_name,
            last_name: author.last_name,
            role: author.role
        }));
        
        res.status(200).send({ message: `Recommend route for mangaId: ${req.params.mangaId}`, correctedMangaInfo, authors: formattedAuthors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});

module.exports = router;
