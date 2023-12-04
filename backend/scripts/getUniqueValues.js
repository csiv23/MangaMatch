// getUniqueValues.js
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGODB_URI;
const dbName = 'MangaMatch';
const collectionName = 'Manga2';

async function getUniqueValues(fieldName) {
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
        const uniqueValuesSet = new Set();

        await cursor.forEach(doc => {
            try {
                const fieldValue = doc[fieldName];
    
                if (typeof fieldValue === 'string') {
                    // Check if the string is JSON
                    try {
                        const valueArray = JSON.parse(fieldValue.replace(/'/g, '"'));
                        
                        // It's JSON; add each value in the array to the set
                        valueArray.forEach(value => uniqueValuesSet.add(value));
                    } catch (e) {
                        // It's not JSON; just add the whole string to the set
                        uniqueValuesSet.add(fieldValue);
                    }
                } else if (Array.isArray(fieldValue)) {
                    // It's an array; add each value in the array to the set
                    fieldValue.forEach(value => uniqueValuesSet.add(value));
                } else {
                    console.warn(`${fieldName} has unsupported type:`, typeof fieldValue);
                }
            } catch (e) {
                console.error(`Error processing ${fieldName}:`, e);
            }
        });

        // Output the unique values
        console.log(`Unique ${fieldName}s:`, uniqueValuesSet);
    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        await client.close();
    }
}

// Get the field name from the command line arguments
const fieldName = process.argv[2];
if (!fieldName) {
    console.error('Please provide a field name as a command line argument.');
    process.exit(1);
}

// Run the function to get unique values
getUniqueValues(fieldName);
