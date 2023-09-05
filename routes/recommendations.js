const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const { buildGenreList, mangaToVector } = require('../utils/vectorization');

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] ** 2;
        normB += vecB[i] ** 2;
    }

    // Debug and error checks
    if (normA === 0 || normB === 0) {
        console.error('Vector with zero magnitude found, check your data:', vecA, vecB);
        return 0; // or other value to indicate the error
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}


router.get('/:mangaId', async (req, res) => {
    try {
        const targetManga = await Manga.findOne({ manga_id: req.params.mangaId });
        // Limit to 50 records for speed
        const allMangas = await Manga.find({}).limit(50);

        // Make sure queries return the expected data
        console.log('Target Manga:', targetManga);
        console.log('Number of Mangas:', allMangas.length);

        // Vectorize genres
        const genreList = buildGenreList(allMangas);
        const targetVector = mangaToVector(targetManga, genreList);

        let firstMatch = null;

        for (const manga of allMangas) {
            if (manga.manga_id !== targetManga.manga_id) {
                const vec = mangaToVector(manga, genreList);
                const similarity = cosineSimilarity(targetVector, vec);

                // Log each similarity score for debugging
                console.log(`Similarity between ${targetManga.title} and ${manga.title}: ${similarity}`);

                if (similarity > 0.5) {
                    firstMatch = manga;
                    break;
                }
            }
        }

        if (firstMatch) {
            res.status(200).send(firstMatch);
        } else {
            res.status(200).send("No recommendations found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});


module.exports = router;
