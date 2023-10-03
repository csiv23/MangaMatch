// removeNullScoreManga.js
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017';
const dbName = 'MangaMatch';
const collectionName = 'Manga2';

(async () => {
  // Create a new MongoClient
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();
    
    // Get a handle on the database and collection
    const collection = client.db(dbName).collection(collectionName);

    // Remove documents where score is null
    const deleteResult = await collection.deleteMany({ score: null });
    
    // Log the number of removed documents
    console.log(`Successfully deleted ${deleteResult.deletedCount} entries where score is null.`);
  } catch (err) {
    // Log any errors that occur
    console.error(`Failed to delete entries: ${err.message}`);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
})();
