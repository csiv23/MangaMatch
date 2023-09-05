const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const {
    mangaToVector,
    computeAverageVector,
    findTopNSimilar,
    findCommonGenres
} = require('../utils/vectorization');

router.post('/', async (req, res) => {
    try {
        const { mangaIds } = req.body;
        const targetMangas = await Manga.find({ manga_id: { $in: mangaIds } });
        const allMangas = await Manga.find({}).limit(10);

        const targetVectors = targetMangas.map(mangaToVector);
        const allVectors = allMangas.map(manga => ({ item: manga, vector: mangaToVector(manga) }));

        const avgVector = computeAverageVector(targetVectors);

        // Filter out mangas that were originally in the payload
        const filteredVectors = allVectors.filter(vec => !mangaIds.includes(vec.item.manga_id.toString()));

        const topMangas = findTopNSimilar(avgVector, filteredVectors);


        console.log("Top 5 mangas and their cosine similarities:", topMangas.map(m => {
            const commonGenres = findCommonGenres(avgVector, m.vector);
            return {
                mangaId: m.item.manga_id,
                title: m.item.title,
                similarity: m.similarity,
                commonGenres
            };
        }));


        res.status(200).send(topMangas.map(m => m.item));
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong!');
    }
});

module.exports = router;
