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
    const startTime = Date.now(); // Start logging the time

    try {
        const { mangaIds } = req.body;

        // Optimized: Execute two database queries in parallel to reduce database fetching time
        const [targetMangas, allMangas] = await Promise.all([
            Manga.find({ manga_id: { $in: mangaIds } }),
            Manga.find({})
        ]);

        const targetVectors = targetMangas.map(mangaToVector);
        const avgVector = computeAverageVector(targetVectors);

        // Optimized: Map once to get both the vector and the manga data, preventing double iteration over allMangas
        const allVectors = allMangas.map(manga => ({ item: manga, vector: mangaToVector(manga) }));
        const mangaIdSet = new Set(mangaIds.map(String)); // Optimized: Use a Set for faster lookup
        const filteredVectors = allVectors.filter(vec => !mangaIdSet.has(vec.item.manga_id.toString()));

        // Optimized: Using Promise.all to process batches in parallel, leveraging more CPU cores
        const batchPromises = [];
        for (let i = 0; i < filteredVectors.length; i += OPTIMAL_BATCH_SIZE) {
            const batch = filteredVectors.slice(i, i + OPTIMAL_BATCH_SIZE);
            batchPromises.push(processBatch(avgVector, batch));
        }
        const batchResults = await Promise.all(batchPromises);

        // Optimized: Flattening batch results in one go, avoiding repeated concatenation
        let topMangas = batchResults.flat();

        topMangas.sort((a, b) => b.similarity - a.similarity);
        topMangas = topMangas.slice(0, 10);

        console.log(
            "Top 10 mangas and their cosine similarities:",
            JSON.stringify(
                topMangas.map(m => ({
                    mangaId: m.item.manga_id,
                    title: m.item.title,
                    similarity: m.similarity,
                    commonItems: findCommonItems(targetVectors, m.vector) // Now using combinedList
                })),
                null,
                2
            )
        );

        const endTime = Date.now(); // End logging the time
        console.log(`Recommendations generated in ${endTime - startTime} ms`); // Log the time taken

        res.status(200).send(topMangas.map(m => m.item));
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});

module.exports = router;
