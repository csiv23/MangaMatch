// vectorization.js
const { safeParseJSON } = require('./jsonHelper');  // Import the function

// Sorted and array-form of unique genres
const genreList = [
    'Action',
    'Adventure',
    'Avant Garde',
    'Award Winning',
    'Boys Love',
    'Comedy',
    'Drama',
    'Ecchi',
    'Erotica',
    'Fantasy',
    'Girls Love',
    'Gourmet',
    'Hentai',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Slice of Life',
    'Sports',
    'Supernatural',
    'Suspense'
].sort();

/**
 * Converts a single manga object into a binary vector based on the given genre list.
 * 
 * Each position in the vector corresponds to a genre. If the manga is of that genre, 
 * that position will have a `1`, otherwise it will be `0`.
 * 
 * @param {Object} manga - A manga object.
 * @returns {Array} - The binary vector representation of the manga's genres.
 */
function mangaToVector(manga) {
    let vector = [];
    const genres = safeParseJSON(manga.genres[0], []);
    for (const genre of genreList) {
        vector.push(genres.includes(genre) ? 1 : 0);
    }
    return vector;
}

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

module.exports = {
    mangaToVector,
    cosineSimilarity
};
