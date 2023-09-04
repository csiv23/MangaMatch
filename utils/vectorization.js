// vectorization.js

/**
 * Builds a list of all unique genres across all mangas.
 * 
 * @param {Array} allMangas - All manga objects from the database.
 * @returns {Array} - The list of unique genres.
 */
function buildGenreList(allMangas) {
    let genreSet = new Set();
    
    for (const manga of allMangas) {
        for (const genre of manga.genres) {
            genreSet.add(genre);
        }
    }

    return Array.from(genreSet);
}

/**
 * Converts a single manga object into a binary vector based on the given genre list.
 * 
 * Each position in the vector corresponds to a genre. If the manga is of that genre, 
 * that position will have a `1`, otherwise it will be `0`.
 * 
 * @param {Object} manga - A manga object.
 * @param {Array} genreList - List of genres for vectorization.
 * @returns {Array} - The binary vector representation of the manga's genres.
 */
function mangaToVector(manga, genreList) {
    let vector = [];

    for (const genre of genreList) {
        vector.push(manga.genres.includes(genre) ? 1 : 0);
    }

    return vector;
}

module.exports = {
    buildGenreList,
    mangaToVector
};