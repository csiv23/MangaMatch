const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const { mangaToVector, cosineSimilarity } = require('../utils/vectorization');


router.get('/:mangaId', async (req, res) => {
    try {
        const targetManga = await Manga.findOne({ manga_id: req.params.mangaId });
        const allMangas = await Manga.find({}).limit(100);  // Limit to 100 records

        console.log('Target Manga:', targetManga);
        console.log('Number of Mangas:', allMangas.length);

        const targetVector = mangaToVector(targetManga);

        let topMatches = [];

        for (const manga of allMangas) {
            if (manga.manga_id !== targetManga.manga_id && manga.genres) {
                const vec = mangaToVector(manga);

                if (vec.every(val => val === 0)) {
                    continue; // Skip this iteration as the vector is all zeros
                }

                const similarity = cosineSimilarity(targetVector, vec);
                console.log(`Similarity between ${targetManga.title} and ${manga.title}: ${similarity}`);

                if (isNaN(similarity)) {
                    continue; // Skip this iteration if similarity is NaN
                }

                topMatches.push({ manga, similarity });
            }
        }

        // Sort by highest similarity and take the top 5
        topMatches.sort((a, b) => b.similarity - a.similarity);
        const top5Matches = topMatches.slice(0, 5).map(match => match.manga);

        if (top5Matches.length > 0) {
            res.status(200).send(top5Matches);
        } else {
            res.status(200).send("No recommendations found.");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});




module.exports = router;
