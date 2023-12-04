// removeUnsafeManga.js
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGODB_URI;
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

    // Remove documents where sfw is false
    const deleteResult = await collection.deleteMany({ sfw: false });
    
    // Log the number of removed documents
    console.log(`Successfully deleted ${deleteResult.deletedCount} entries where sfw is false.`);
  } catch (err) {
    // Log any errors that occur
    console.error(`Failed to delete entries: ${err.message}`);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
})();
