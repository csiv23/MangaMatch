// getUniqueThemes.js
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017';
const dbName = 'MangaMatch';
const collectionName = 'Manga2';

async function getUniqueThemes() {
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
        const uniqueThemesSet = new Set();

        await cursor.forEach(doc => {
            try {
                if (typeof doc.themes === 'string') {
                    // Parse the string as a JSON array
                    const themesArray = JSON.parse(doc.themes.replace(/'/g, '"'));

                    // Add each theme to the set
                    themesArray.forEach(theme => uniqueThemesSet.add(theme));
                } else {
                    console.warn('Themes is not a string:', doc.themes);
                }
            } catch (e) {
                console.error('Error parsing themes:', e);
            }
        });

        // Output the unique themes
        console.log('Unique themes:', uniqueThemesSet);

    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        await client.close();
    }
}

// Run the function to get unique themes
getUniqueThemes();
