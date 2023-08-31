const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the manga collection
const mangaSchema = new Schema({
    manga_id: Number,
    title: String,
    type: String,
    score: Number,
    scored_by: Number,
    status: String,
    volumes: Number,
    chapters: Number,
    start_date: Date,
    end_date: Date,
    members: Number,
    favorites: Number,
    sfw: Boolean,
    approved: Boolean,
    created_at_before: String, // Keeping as String for now, but consider using Date if applicable
    updated_at: String, // Keeping as String for now, but consider using Date if applicable
    real_start_date: Date,
    real_end_date: Date,
    genres: String,
    themes: String,
    demographics: String,
    authors: String, // This seems to be a stringified array of objects, but consider creating a separate schema for this if needed
    serializations: String,
    synopsis: String,
    background: String,
    main_picture: String,
    url: String,
    title_japanese: String,
    title_synonyms: [String] // An array of strings
});

// Create a text index for the title field
mangaSchema.index({ title: 'text' });

// Export the model
module.exports = mongoose.model('MangaMatch', mangaSchema, 'Manga');
