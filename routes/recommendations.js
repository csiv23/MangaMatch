const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const {
    mangaToVector,
    computeAverageVector,
    findTopNSimilar,
    findCommonGenres
} = require('../utils/vectorization');

const BATCH_SIZE = 50;

async function processBatch(targetVector, batch, callback) {
    const batchResult = findTopNSimilar(targetVector, batch);
    if (callback) callback(batchResult);
    return batchResult;
}


router.post('/', async (req, res) => {
    try {
        const { mangaIds } = req.body;
        const targetMangas = await Manga.find({ manga_id: { $in: mangaIds } });
        const allMangas = await Manga.find({});

        const targetVectors = targetMangas.map(mangaToVector);
        const allVectors = allMangas.map(manga => ({ item: manga, vector: mangaToVector(manga) }));

        const avgVector = computeAverageVector(targetVectors);

        // Filter out mangas that were originally in the payload
        const filteredVectors = allVectors.filter(vec => !mangaIds.includes(vec.item.manga_id.toString()));

        const topMangas = findTopNSimilar(avgVector, filteredVectors);


        console.log("Top 5 mangas and their cosine similarities:",
            JSON.stringify(
                topMangas.map(m => {
                    const commonGenres = findCommonGenres(targetVectors, m.vector);
                    return {
                        mangaId: m.item.manga_id,
                        title: m.item.title,
                        similarity: m.similarity,
                        commonGenres // Now an object with genre as key and occurrence count as value
                    };
                }), null, 2
            )
        );


        res.status(200).send(topMangas.map(m => m.item));
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});

module.exports = router;
