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


const OPTIMAL_BATCH_SIZE = 250;

async function processBatch(targetVector, batch) {
    const topMangasInBatch = findTopNSimilar(targetVector, batch);
    return topMangasInBatch;
}

router.post('/', async (req, res) => {
    try {
        const mangaIds = req.body.mangaIds.map(id => Number(id));

        const targetMangas = await Manga.find({ manga_id: { $in: mangaIds } });

        const targetTitles = new Set(targetMangas.map(manga => manga.title.toLowerCase()));
        const allMangas = await Manga.find({});

        const targetVectors = targetMangas.map(mangaToVector);
        const allVectors = allMangas.map(manga => ({ item: manga, vector: mangaToVector(manga) }));

        const avgVector = computeAverageVector(targetVectors);
        const filteredVectors = filterMangaVectors(targetVectors, allVectors, combinedList, targetTitles, mangaIds);

        let topMangas = [];
        for (let i = 0; i < filteredVectors.length; i += OPTIMAL_BATCH_SIZE) {
            const batch = filteredVectors.slice(i, i + OPTIMAL_BATCH_SIZE);
            const batchResult = await processBatch(avgVector, batch);
            topMangas = topMangas.concat(batchResult);
        }

        topMangas.sort((a, b) => b.similarity - a.similarity);
        topMangas = topMangas.slice(0, 10);

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

        res.status(200).send(topMangas.map(m => m.item));
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});

module.exports = router;

module.exports = router;
