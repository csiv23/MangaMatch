const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const {
    mangaToVector,
    computeAverageVector,
    findTopNSimilar,
    findCommonItems
} = require('../utils/vectorization');

const OPTIMAL_BATCH_SIZE = 250;

// Function to process a batch and return the results
async function processBatch(targetVector, batch) {
    return findTopNSimilar(targetVector, batch);
}

router.post('/', async (req, res) => {
    try {

        console.time("Recommendation Generation Time");

        const { mangaIds } = req.body;

        const [targetMangas, allMangas] = await Promise.all([
            Manga.find({ manga_id: { $in: mangaIds } }),
            Manga.find({})
        ]);

        const targetVectors = targetMangas.map(mangaToVector);
        const avgVector = computeAverageVector(targetVectors);

        const allVectors = allMangas.map(manga => ({ item: manga, vector: mangaToVector(manga) }));
        const filteredVectors = allVectors.filter(vec => !mangaIds.includes(vec.item.manga_id.toString()));

        let topMangas = [];
        const batchPromises = [];
        for (let i = 0; i < filteredVectors.length; i += OPTIMAL_BATCH_SIZE) {
            const batch = filteredVectors.slice(i, i + OPTIMAL_BATCH_SIZE);
            batchPromises.push(processBatch(avgVector, batch));
        }

        const batchResults = await Promise.all(batchPromises);
        topMangas = batchResults.flat();

        topMangas.sort((a, b) => b.similarity - a.similarity);
        topMangas = topMangas.slice(0, 10);

        console.log("Debug: targetVectors in recommendations.js", targetVectors);

        console.log(
            "Top 10 mangas and their cosine similarities:",
            JSON.stringify(
                topMangas.map(m => ({
                    mangaId: m.item.manga_id,
                    title: m.item.title,
                    similarity: m.similarity,
                    commonItems: findCommonItems(targetVectors, m.vector)
                })),
                null,
                2
            )
        );

        console.timeEnd("Recommendation Generation Time");


        res.status(200).send(topMangas.map(m => m.item));
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});

module.exports = router;
