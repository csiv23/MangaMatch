// Utility for connecting to MongoDB

const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

// Function to establish connection to the database
module.exports = async function dbConnection() {
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('MongoDB connected');
};
