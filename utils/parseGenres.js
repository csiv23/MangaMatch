// Utility to parse genres from the provided string representation

// Function to extract individual genres from a string
function parseGenres(genresString) {
    const genres = genresString.slice(1, -1).split(', ');
    return genres.map(genre => genre.slice(1, -1));
}

module.exports = parseGenres;
