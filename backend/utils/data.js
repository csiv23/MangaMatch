const demographicsList = [
    'Shounen',
    'Shoujo',
    'Seinen',
    'Josei',
    'Kids'
].sort();

const typeList = [
    'manga',
    'manhwa',
    'light_novel',
    'one_shot',
    'manua',
    'novel',
    'doujinshi'
].sort();


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

const combinedList = [...genreList, ...themeList, ...demographicsList];

module.exports = {
    genreList,
    themeList,
    demographicsList,
    typeList,
    combinedList
};