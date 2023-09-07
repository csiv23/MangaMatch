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

const themeList = [
    'Gore',
    'Military',
    'Mythology',
    'Psychological',
    'Historical',
    'Samurai',
    'Romantic Subtext',
    'School',
    'Adult Cast',
    'Parody',
    'Super Power',
    'Team Sports',
    'Delinquents',
    'Workplace',
    'Survival',
    'Childcare',
    'Iyashikei',
    'Reincarnation',
    'Showbiz',
    'Anthropomorphic',
    'Love Polygon',
    'Music',
    'Mecha',
    'Combat Sports',
    'Isekai',
    'Gag Humor',
    'Crossdressing',
    'Reverse Harem',
    'Martial Arts',
    'Visual Arts',
    'Harem',
    'Otaku Culture',
    'Time Travel',
    'Video Game',
    'Strategy Game',
    'Vampire',
    'Mahou Shoujo',
    'High Stakes Game',
    'CGDCT',
    'Organized Crime',
    'Detective',
    'Performing Arts',
    'Medical',
    'Space',
    'Memoir',
    'Villainess',
    'Racing',
    'Pets',
    'Magical Sex Shift',
    'Educational',
    'Idols (Female)',
    'Idols (Male)'
].sort();

// Assuming genreList and themeList are arrays of unique strings
const combinedList = [...genreList, ...themeList];


// Converts a single manga object into a binary vector based on the combinedList.
function mangaToVector(manga) {
    let vector = [];
    const genres = safeParseJSON(manga.genres[0], []);
    const themes = safeParseJSON(manga.themes[0], []);

    const allAttributes = [...genres, ...themes];

    // Process genres and themes
    for (const item of combinedList) {
        vector.push(allAttributes.includes(item) ? 1 : 0);
    }

    return vector;
}


// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB, themesOffset) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        if (i >= themesOffset) {
            // Optional themes, don't contribute if both are 0
            if (vecA[i] === 0 && vecB[i] === 0) {
                continue;
            }
        }
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] ** 2;
        normB += vecB[i] ** 2;
    }

    // Debug and error checks
    if (normA === 0 || normB === 0) {
        return 0;
    }

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return similarity;
}

// Add this function to compute average vector
function computeAverageVector(vectors) {
    const avgVector = new Array(genreList.length).fill(0);

    // Sum up vectors
    for (const vec of vectors) {
        for (let i = 0; i < avgVector.length; i++) {
            avgVector[i] += vec[i];
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
        .slice(0, 5);  // Return top 5
}


// Updated findCommonItems to work with combinedList
function findCommonItems(vectors, vecToCompare) {
    let commonItemCounts = {};

    for (let i = 0; i < vecToCompare.length; i++) {
        if (vecToCompare[i] === 1 && typeof combinedList[i] !== 'undefined') {
            for (let vec of vectors) {
                if (vec[i] === 1) {
                    commonItemCounts[combinedList[i]] = (commonItemCounts[combinedList[i]] || 0) + 1;
                }
            }
        }
    }

    // Get the keys and sort them based on the value
    const sortedKeys = Object.keys(commonItemCounts).sort((a, b) => commonItemCounts[b] - commonItemCounts[a]);

    // Create a new sorted object
    const sortedCommonItems = {};
    for (const key of sortedKeys) {
        sortedCommonItems[key] = commonItemCounts[key];
    }

    return sortedCommonItems;
}


module.exports = {
    mangaToVector,
    cosineSimilarity,
    computeAverageVector,
    findTopNSimilar,
    findCommonItems
};
