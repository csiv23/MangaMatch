// getMangaGenres.js
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017';
const dbName = 'MangaMatch';
const collectionName = 'Manga2';

async function getUniqueGenres() {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        // Connect to MongoDB client
        await client.connect();

        // Connect to the database and collection
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const cursor = collection.find({});
        const uniqueGenresSet = new Set();

        await cursor.forEach(doc => {
            try {
                if (typeof doc.genres === 'string') {
                    // Parse the string as a JSON array
                    const genresArray = JSON.parse(doc.genres.replace(/'/g, '"'));

                    // Add each genre to the set
                    genresArray.forEach(genre => uniqueGenresSet.add(genre));
                } else {
                    console.warn('Genres is not a string:', doc.genres);
                }
            } catch (e) {
                console.error('Error parsing genres:', e);
            }
        });

        // Output the unique genres
        console.log('Unique genres:', uniqueGenresSet);

    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        await client.close();
    }
}

// Run the function to get unique genres
getUniqueGenres();
