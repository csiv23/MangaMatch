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

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

    return similarity;
}

// Add this function to compute average vector
function computeAverageVector(vectors) {
    const avgVector = [];
    for (const vec of vectors) {
        if (avgVector.length === 0) {
            // Initialize avgVector on first iteration
            for (let i = 0; i < vec.length; i++) {
                avgVector[i] = vec[i];
            }
        } else {
            // Sum up vectors
            for (let i = 0; i < avgVector.length; i++) {
                avgVector[i] += vec[i];
            }
        }
    }

    // Compute the average
    for (let i = 0; i < avgVector.length; i++) {
        avgVector[i] /= vectors.length;
    }

    return avgVector;
}

/**
 * Finds the top N most similar items to the given vector
 * 
 * @param {Array} targetVector - The vector to compare against.
 * @param {Array} vectors - An array of items with their vectors.
 * @returns {Array} - The top N most similar items.
 */
function findTopNSimilar(targetVector, vectors) {
    return vectors.map(vec => {
        return { item: vec.item, similarity: cosineSimilarity(targetVector, vec.vector), vector: vec.vector };
    })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
}


/**
 * Finds the common genres between a vector and a list of other vectors.
 * 
 * @param {Array} vectors - The list of target vectors.
 * @param {Array} vecToCompare - The vector to compare with the list.
 * @returns {Object} - The common genres and their occurrence counts.
 */
function findCommonGenres(vectors, vecToCompare) {
    let commonGenreCounts = {};

    for (let i = 0; i < vecToCompare.length; i++) {
        if (vecToCompare[i] === 1) {
            for (let vec of vectors) {
                if (vec[i] === 1) {
                    commonGenreCounts[genreList[i]] = (commonGenreCounts[genreList[i]] || 0) + 1;
                }
            }
        }
    }

    const commonGenres = Object.entries(commonGenreCounts)  // Changed from genreCount to commonGenreCounts
        .sort((a, b) => b[1] - a[1])
        .map(([genre, count]) => `${genre}(${count})`);

    return commonGenres;
}


module.exports = {
    mangaToVector,
    cosineSimilarity,
    computeAverageVector,
    findTopNSimilar,
    findCommonGenres
};
