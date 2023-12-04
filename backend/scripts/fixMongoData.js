// fixMongoData.js
const fs = require('fs');
const csv = require('csv-parser');
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGODB_URI;
const dbName = 'MangaMatch';
const collectionName = 'Manga2';

(async () => {
    const client = new MongoClient(uri);
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);

    // Read the CSV file
    fs.createReadStream('manga.csv')
        .pipe(csv())
        .on('data', async (row) => {
            try {
                // Fix the authors field from a string to a JSON object
                const authors = JSON.parse(row.authors.replace(/'/g, '"'));
                
                // Log the modified authors field to console for debugging
                console.log('Modified authors:', authors);

                // Replace the authors string with the new JSON object
                row.authors = authors;

                // Insert the row into MongoDB
                await collection.insertOne(row);
            } catch (err) {
                console.error(`Failed to insert row: ${JSON.stringify(row)}. Reason: ${err.message}`);
            }
        })
        .on('end', async () => {
            console.log('CSV file successfully processed.');
            await client.close();
        });
})();
