const mongoose = require('mongoose');
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

async function processBatch(targetVector, batch) {
    return findTopNSimilar(targetVector, batch);
}

router.post('/', async (req, res) => {
    try {
        const mangaIds = req.body.mangaIds.map(id => Number(id));
        const targetMangas = await Manga.find({ manga_id: { $in: mangaIds } });

        // Create a set of lowercase titles for the target mangas to facilitate the case-insensitive comparison
        const targetTitles = new Set(targetMangas.map(manga => manga.title.toLowerCase()));
        const allMangas = await Manga.find({});

        const targetVectors = targetMangas.map(mangaToVector);
        const allVectors = allMangas.map(manga => ({ item: manga, vector: mangaToVector(manga) }));
        const avgVector = computeAverageVector(targetVectors);

        // Filter out mangas that have a title containing a part of any of the target manga titles
        const filteredVectors = allVectors.filter(vec => {
            const lowerCaseVecTitle = vec.item.title.toLowerCase();
            return !mangaIds.includes(vec.item.manga_id) &&
                ![...targetTitles].some(title => {
                    const titleWords = title.split(' ');
                    return titleWords.includes(lowerCaseVecTitle) ||
                        title === lowerCaseVecTitle ||
                        titleWords.some(word => lowerCaseVecTitle.includes(word));
                });
        });

        // Identifying the base title to categorize manga into series
        const getBaseTitle = (title) => {
            const separators = [':', '-'];
            let baseTitle = title;
            separators.forEach((sep) => {
                if (title.includes(sep)) {
                    baseTitle = title.split(sep)[0].trim();
                }
            });
            return baseTitle.toLowerCase();
        };

        // Further filtering vectors to include only one manga per series
        const uniqueSeriesVectors = [];
        const uniqueSeriesTitles = new Set();
        filteredVectors.forEach(vec => {
            const baseTitle = getBaseTitle(vec.item.title);
            if (!uniqueSeriesTitles.has(baseTitle)) {
                uniqueSeriesVectors.push(vec);
                uniqueSeriesTitles.add(baseTitle);
            }
        });

        let topMangas = [];
        for (let i = 0; i < uniqueSeriesVectors.length; i += OPTIMAL_BATCH_SIZE) {
            const batch = uniqueSeriesVectors.slice(i, i + OPTIMAL_BATCH_SIZE);
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
