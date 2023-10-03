const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const {
    mangaToVector,
    computeAverageVector,
    findTopNSimilar,
    findCommonItems,
    filterMangaVectors
} = require('../utils/vectorization');
const { genreList, themeList, demographicsList, combinedList } = require('../utils/data.js');

// Define the optimal batch size for processing vectors
const OPTIMAL_BATCH_SIZE = 250;

/**
 * Processes a batch of manga vectors and finds the top mangas in that batch based on similarity.
 * 
 * @param {Array} targetVector - The target vector for similarity computation.
 * @param {Array} batch - The batch of vectors to compare against the target vector.
 * @returns {Array} Top similar mangas within the batch.
 */
async function processBatch(targetVector, batch) {
    const topMangasInBatch = findTopNSimilar(targetVector, batch);
    return topMangasInBatch;
}

router.post('/', async (req, res) => {
    try {
        // Fetch manga IDs from the request body
        const mangaIds = req.body.mangaIds.map(id => Number(id));

        // Fetch manga data for target mangas
        const targetMangas = await Manga.find({ manga_id: { $in: mangaIds } });

        // Create a set of lowercased target titles
        const targetTitles = new Set(targetMangas.map(manga => manga.title.toLowerCase()));

        // Fetch all mangas from the database
        const allMangas = await Manga.find({});

        // Vectorize the manga data
        const targetVectors = targetMangas.map(mangaToVector);
        const allVectors = allMangas.map(manga => ({ item: manga, vector: mangaToVector(manga) }));

        // Compute the average vector for target mangas
        const avgVector = computeAverageVector(targetVectors);

        // Filter vectors based on the user's library and other criteria
        const filteredVectors = filterMangaVectors(targetVectors, allVectors, combinedList, targetTitles, mangaIds);

        // Initialize an empty array to store the top mangas
        let topMangas = [];

        // Perform batch processing to efficiently find the top mangas
        for (let i = 0; i < filteredVectors.length; i += OPTIMAL_BATCH_SIZE) {
            const batch = filteredVectors.slice(i, i + OPTIMAL_BATCH_SIZE);
            const batchResult = await processBatch(avgVector, batch);
            topMangas = topMangas.concat(batchResult);
        }

        // Sort the top mangas based on their scores and limit to top 10
        topMangas.sort((a, b) => b.item.score - a.item.score);
        topMangas = topMangas.slice(0, 10);

        // Logging the top 10 mangas and their scores
        console.log(
            "Top 10 mangas and their scores:",
            JSON.stringify(
                topMangas.map(m => ({
                    mangaId: m.item.manga_id,
                    title: m.item.title,
                    score: m.item.score,
                    similarity: m.similarity,
                    commonItems: findCommonItems(targetVectors, m.vector)
                })),
                null,
                2
            )
        );

        // Send the top 10 mangas as the response
        res.status(200).send(topMangas.map(m => m.item));
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});

module.exports = router;
