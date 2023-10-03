const { safeParseJSON } = require('./jsonHelper');
const { genreList, themeList, demographicsList, combinedList } = require('../utils/data.js');

const vectorMemo = new Map();

function mangaToVector(manga) {
    const genres = safeParseJSON(manga.genres[0], []);
    const themes = safeParseJSON(manga.themes[0], []);
    const demographics = manga.demographics;

    const allAttributes = [...genres, ...themes, ...demographics];

    const attributesKey = allAttributes.sort().join(',');

    if (vectorMemo.has(attributesKey)) {
        return vectorMemo.get(attributesKey);
    }

    let vector = [];

    for (const item of combinedList) {
        vector.push(allAttributes.includes(item) ? 1 : 0);
    }

    vectorMemo.set(attributesKey, vector);

    return vector;
}

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
    const kidsIndex = combinedList.indexOf('Kids');  // Find the index representing the 'Kids' demographic in our attribute list

    // If one vector has 'Kids' attribute and the other does not, return 0.00 to prevent recommendation
    if ((vecA[kidsIndex] === 1 && vecB[kidsIndex] === 0) || (vecA[kidsIndex] === 0 && vecB[kidsIndex] === 1)) {
        return 0.00;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] ** 2;
        normB += vecB[i] ** 2;
    }

    if (normA === 0 || normB === 0) {
        return 0.00;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
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
    const kidsIndex = 48;  // Find the index representing the 'Kids' demographic in our attribute list
    const hasKidsDemographic = targetVectors.some(vector => vector[kidsIndex] === 1);

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

    if (hasKidsDemographic) {
        avgVector[kidsIndex] = 1;  // If any target vector has the 'Kids' attribute, set it to 1 in the avgVector
    }

    return avgVector;
}

function findTopNSimilar(targetVector, vectors, title, N = 5) {
    const mappedVectors = vectors.map(vec => {
        return { item: vec.item, similarity: cosineSimilarity(targetVector, vec.vector), vector: vec.vector };
    });

    const topNSimilar = mappedVectors.sort((a, b) => b.similarity - a.similarity).slice(0, N);

    if (title === 'Hunter x Hunter') {
        topNSimilar.forEach((manga, index) => {
            console.log(`[Find Top N Similar - HxH] Rank: ${index + 1}, Manga ID: ${manga.item.manga_id}, Title: ${manga.item.title}, Cosine Similarity: ${manga.similarity.toFixed(4)}`);
        });
    }

    return topNSimilar;
}

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

    const sortedKeys = Object.keys(commonItemCounts).sort((a, b) => commonItemCounts[b] - commonItemCounts[a]);

    const sortedCommonItems = {};
    for (const key of sortedKeys) {
        sortedCommonItems[key] = commonItemCounts[key];
    }

    return sortedCommonItems;
}

function filterMangaVectors(targetVectors, allVectors, combinedList, targetTitles, mangaIds) {
    const kidsIndex = 48;
    
    const hasKidsDemographic = targetVectors.some(vector => vector[kidsIndex] === 1);
    

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

    let uniqueSeriesVectors = [];
    const uniqueSeriesTitles = new Set();
    filteredVectors.forEach(vec => {
        const baseTitle = getBaseTitle(vec.item.title);
        if (!uniqueSeriesTitles.has(baseTitle)) {
            uniqueSeriesVectors.push(vec);
            uniqueSeriesTitles.add(baseTitle);
        }
    });

    if (hasKidsDemographic) {
        uniqueSeriesVectors = uniqueSeriesVectors.filter(vec => {
            const isInKidsDemographic = JSON.stringify(vec.item.demographics).includes('Kids');

            return isInKidsDemographic;
        });
    } else {
        uniqueSeriesVectors = uniqueSeriesVectors.filter(vec => {
            const isNotInKidsDemographic = !JSON.stringify(vec.item.demographics).includes('Kids');

            return isNotInKidsDemographic;
        });
    }



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
