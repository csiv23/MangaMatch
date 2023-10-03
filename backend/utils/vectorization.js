// Importing required modules and data
const { safeParseJSON } = require('./jsonHelper');
const { genreList, themeList, demographicsList, combinedList } = require('../utils/data.js');
const moment = require('moment'); // You'll need to install the moment.js library


// Memoization cache for vectors
const vectorMemo = new Map();

/**
 * Convert a manga object to a vector
 * @param {Object} manga - Manga data object
 * @returns {number[]} - Vector representation of the manga's attributes
 */
function mangaToVector(manga) {
    // Parsing manga attributes
    const genres = safeParseJSON(manga.genres[0], []);
    const themes = safeParseJSON(manga.themes[0], []);
    const demographics = safeParseJSON(manga.demographics[0], []);

    // Combining all attributes
    const allAttributes = [...genres, ...themes, ...demographics];
    const attributesKey = allAttributes.sort().join(',');

    // Check if vector is already memoized, if so return the cached vector
    if (vectorMemo.has(attributesKey)) {
        return vectorMemo.get(attributesKey);
    }

    // Creating and storing the vector
    const vector = combinedList.map(item => allAttributes.includes(item) ? 1 : 0);

    // Cache the calculated vector for future use
    vectorMemo.set(attributesKey, vector);

    return vector;
}

/**
 * Convert a debug vector string to a list of attributes and log them.
 * @param {string} debugString - Debug string containing a vector.
 * @param {Array<string>} attributeList - Sorted list of all possible attributes.
 */
const debugVectorToAttributes = (debugString, attributeList) => {
    // Extract the vector from the debug string
    const vectorString = debugString.split(':')[1].trim();
    const vector = vectorString.split(',').map(Number);

    // Initialize an empty array to store the attributes
    const attributes = [];

    // Loop through the vector and attribute list
    for (let i = 0; i < vector.length; i++) {
        if (vector[i] === 1) {
            // If the value at the index i of vector is 1, add the corresponding attribute
            attributes.push(attributeList[i]);
        }
    }

    // Log the attributes
    console.log(`Attributes for ${debugString.split(' ')[1]}: ${attributes}`);
};

/**
 * Computes cosine similarity between two vectors. If one vector has 'Kids' attribute and the other does not,
 * it returns 0.00 to prevent recommendation. Otherwise, it computes the cosine similarity as the dot product of
 * the vectors divided by the product of their norms.
 *
 * @param {number[]} vecA - The first vector.
 * @param {number[]} vecB - The second vector.
 * @returns {number} - The cosine similarity between vecA and vecB.
 */
function cosineSimilarity(vecA, vecB) {

    const kidsIndex = 74;  // Index representing the 'Kids' demographic

    // If one vector has 'Kids' and the other does not, return 0.00
    if ((vecA[kidsIndex] === 1 && vecB[kidsIndex] === 0) ||
        (vecA[kidsIndex] === 0 && vecB[kidsIndex] === 1)) {
        return 0.00;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += Math.pow(vecA[i], 2);
        normB += Math.pow(vecB[i], 2);
    }

    // Calculate cosine similarity
    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

    return Number.isNaN(similarity) ? 0 : similarity.toFixed(2);
}

/**
 * Computes the cosine similarity between two vectors and applies a penalty based on the difference
 * in the number of members for both mangas.
 * 
 * @param {number[]} vecA - The first vector.
 * @param {number[]} vecB - The second vector.
 * @param {number} membersA - Number of members for the first manga.
 * @param {number} membersB - Number of members for the second manga.
 * @returns {number} - The cosine similarity between vecA and vecB.
 */
function cosineSimilarityWithMembers(vecA, vecB, membersA, membersB) {
    let similarity = cosineSimilarity(vecA, vecB);

    // Penalize similarity based on the member count difference
    const memberDiff = Math.abs(membersA - membersB);

    // Apply the penalty to the similarity score; adjust the multiplier as needed
    similarity = similarity - (memberDiff * 0.0000006); 

    return similarity;
}

/**
 * Computes the average vector from a list of target vectors. If any of the target vectors have the 'Kids' genre,
 * the average vector will also have the 'Kids' genre set to 1, alongside other genres found in the target vectors.
 * 
 * @param {number[][]} targetVectors - A list of target vectors to compute the average from.
 * @returns {number[]} - The average vector representing all genres found in the target vectors.
 */
function computeAverageVector(targetVectors) {
    const avgVector = [];

    for (let i = 0; i < targetVectors[0].length; i++) {
        let sum = 0;
        for (let j = 0; j < targetVectors.length; j++) {
            sum += targetVectors[j][i];
        }
        avgVector.push(sum / targetVectors.length);
    }

    for (let i = 0; i < avgVector.length; i++) {
        avgVector[i] = avgVector[i] > 0 ? 1 : 0;
    }

    return avgVector;
}

// Find N most similar items to a target vector considering member count
function findTopNSimilar(targetVector, vectors, title, targetMembers, N = 10) {
    // Map each vector to its item and similarity score
    const mappedVectors = vectors.map(vec => {
        return {
            item: vec.item,
            // Pass the member count for each manga to the cosineSimilarityWithMembers function
            similarity: cosineSimilarityWithMembers(targetVector, vec.vector, targetMembers, vec.item.members),
            vector: vec.vector
        };
    });

    // Filter out vectors with zero similarity score
    const filteredVectors = mappedVectors.filter(vec => vec.similarity > 0);

    // Sort vectors by similarity score and get the top N
    const topNSimilar = filteredVectors.sort((a, b) => b.similarity - a.similarity).slice(0, N);

    return topNSimilar;
}


// Find common attributes between vectors and a vector to compare
function findCommonItems(vectors, vecToCompare) {
    // Object to store the count of each common attribute
    let commonItemCounts = {};

    // Loop through each element in the vector to compare
    for (let i = 0; i < vecToCompare.length; i++) {
        // If the attribute is present (vecToCompare[i] === 1) and defined in combinedList
        if (vecToCompare[i] === 1 && typeof combinedList[i] !== 'undefined') {
            // Loop through each vector in the vectors array
            for (let vec of vectors) {
                // If the attribute is also present in the current vector
                if (vec[i] === 1) {
                    // Increment the count for this attribute
                    commonItemCounts[combinedList[i]] = (commonItemCounts[combinedList[i]] || 0) + 1;
                }
            }
        }
    }

    // Sort attributes by their counts in descending order
    const sortedKeys = Object.keys(commonItemCounts).sort((a, b) => commonItemCounts[b] - commonItemCounts[a]);

    // Create an object with sorted common attributes
    const sortedCommonItems = {};
    for (const key of sortedKeys) {
        sortedCommonItems[key] = commonItemCounts[key];
    }

    return sortedCommonItems;
}


/**
 * Filters out vectors from allVectors that are already present in the user's library or in the target list.
 *
 * @param {Array} targetVectors - The vectors associated with the user's library.
 * @param {Array} allVectors - All available manga vectors.
 * @param {Array} combinedList - A combined list of all items.
 * @param {Array} targetTitles - Titles that the user already has in their library.
 * @param {Array} mangaIds - The manga IDs that the user already has in their library.
 * @returns {Array} An array of unique series vectors.
 */
function filterMangaVectors(targetVectors, allVectors, combinedList, targetTitles, mangaIds) {
    // Filter out vectors that are already in the user's library or match the target titles
    let filteredVectors = allVectors.filter(vec => {
        const lowerCaseVecTitle = vec.item.title.toLowerCase();

        return !mangaIds.includes(vec.item.manga_id) &&
            ![...targetTitles].some(title => {
                const titleWords = title.split(' ');
                return titleWords.includes(lowerCaseVecTitle) ||
                    title === lowerCaseVecTitle ||
                    titleWords.some(word => lowerCaseVecTitle.includes(word));
            });
    });

    // Function to get the base title of a manga (removes any subtitles)
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

    // Keep only unique series in the filtered list (based on base title)
    let uniqueSeriesVectors = [];
    const uniqueSeriesTitles = new Set();
    filteredVectors.forEach(vec => {
        const baseTitle = getBaseTitle(vec.item.title);
        if (!uniqueSeriesTitles.has(baseTitle)) {
            uniqueSeriesVectors.push(vec);
            uniqueSeriesTitles.add(baseTitle);
        }
    });

    return uniqueSeriesVectors;
}


module.exports = {
    mangaToVector,
    cosineSimilarity,
    computeAverageVector,
    findTopNSimilar,
    findCommonItems,
    filterMangaVectors
};
