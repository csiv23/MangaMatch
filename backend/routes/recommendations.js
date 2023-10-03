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

/**
 * Processes a set of manga vectors and finds the top mangas based on similarity.
 * 
 * @param {Array} targetVector - The target vector for similarity computation.
 * @param {Array} vectors - The vectors to compare against the target vector.
 * @returns {Array} Top similar mangas.
 */
async function processVectors(targetVector, vectors, targetMembers) {  // Include targetMembers as a parameter
    const topMangas = findTopNSimilar(targetVector, vectors, "", targetMembers);  // Pass targetMembers here
    return topMangas;
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

        // Compute the average number of members for target mangas
        const avgMembers = targetMangas.reduce((acc, manga) => acc + manga.members, 0) / targetMangas.length;

        // Filter vectors based on the user's library and other criteria
        const filteredVectors = filterMangaVectors(targetVectors, allVectors, combinedList, targetTitles, mangaIds);

        // Perform non-batch processing for comparison
        console.time("Non-Batch Processing Time");  // Start timing for non-batch processing
        const topMangas = await processVectors(avgVector, filteredVectors, avgMembers);
        console.timeEnd("Non-Batch Processing Time");  // End timing for non-batch processing

        // Sort the top mangas based on their scores and limit to top 10
        topMangas.sort((a, b) => b.item.score - a.item.score);
        const top10Mangas = topMangas.slice(0, 10);

        // Logging the top 10 mangas and their scores
        console.log(
            "Top 10 mangas and their scores:",
            JSON.stringify(
                top10Mangas.map(m => ({
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
        res.status(200).send(top10Mangas.map(m => m.item));
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});

module.exports = router;
