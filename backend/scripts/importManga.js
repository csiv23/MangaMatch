// Place this in your importManga.js file

const csv = require('csv-parser'); 
const fs = require('fs');

const filePath = 'C:\\Users\\Cameron\\OneDrive\\Desktop\\repos\\MangaMatch\\manga.csv';

// Counter variable to limit the number of manga processed
let counter = 0;

fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`File not found at path: ${filePath}`);
    } else {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (counter < 2) { // Limit to the first 2 manga
                    try {
                        const authors = JSON.parse(row.authors.replace(/'/g, '"'));
                        // Continue with your logic here
                    } catch (error) {
                        console.error(`Failed to parse JSON for row: ${JSON.stringify(row)}`);
                        console.error(`Error details: ${error}`);
                    }
                    counter++; // Increment the counter
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
    }
});
