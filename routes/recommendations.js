const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const {
    mangaToVector,
    computeAverageVector,
    findTopNSimilar,
    findCommonGenres
} = require('../utils/vectorization');

const OPTIMAL_BATCH_SIZE = 250; // Optimal batch size as determined through testing

// Function to process a batch and return the results
async function processBatch(targetVector, batch) {
    return findTopNSimilar(targetVector, batch);
}

// Main route for recommendations
router.post('/', async (req, res) => {
    try {
        // Fetch data based on received mangaIds
        const { mangaIds } = req.body;
        const targetMangas = await Manga.find({ manga_id: { $in: mangaIds } });
        const allMangas = await Manga.find({});

        // Vectorize the manga data
        const targetVectors = targetMangas.map(mangaToVector);
        const allVectors = allMangas.map(manga => ({ item: manga, vector: mangaToVector(manga) }));
        const avgVector = computeAverageVector(targetVectors);

        // Filter out mangas that were already in the input payload
        const filteredVectors = allVectors.filter(vec => !mangaIds.includes(vec.item.manga_id.toString()));

        // Process batches and collect the top mangas
        let topMangas = [];
        for (let i = 0; i < filteredVectors.length; i += OPTIMAL_BATCH_SIZE) {
            const batch = filteredVectors.slice(i, i + OPTIMAL_BATCH_SIZE);
            const batchResult = await processBatch(avgVector, batch);
            topMangas = topMangas.concat(batchResult);
        }

        // Sort by similarity and pick the top 10 mangas
        topMangas.sort((a, b) => b.similarity - a.similarity);
        topMangas = topMangas.slice(0, 10);

        // Log and send the response
        console.log(
            "Top 10 mangas and their cosine similarities:",
            JSON.stringify(
                topMangas.map(m => ({
                    mangaId: m.item.manga_id,
                    title: m.item.title,
                    similarity: m.similarity,
                    commonGenres: findCommonGenres(targetVectors, m.vector)
                })),
                null,
                2
            )
        );

        res.status(200).send(topMangas.map(m => m.item));
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});

module.exports = router;
