// Utility to parse genres from the provided string representation

// Function to extract individual genres from a string
function parseGenres(genresString) {
    if (Array.isArray(genresString)) {
        return genresString;
    }

    return genresString.slice(1, -1)
        .split(',')
        .map(genre => genre.trim().slice(1, -1));
}

module.exports = parseGenres;

