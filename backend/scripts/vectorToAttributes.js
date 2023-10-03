// Import data from utils/data.js

const { genreList, themeList, demographicsList, combinedList } = require('../utils/data.js');

/**
 * Convert a debug vector string to a list of attributes and log them.
 * @param {string} debugString - Debug string containing a vector.
 * @param {Array<string>} attributeList - Sorted list of all possible attributes.
 */
const debugVectorToAttributes = (debugString, attributeList) => {
    // Extract the vector from the debug string
    const vectorString = debugString.split(':')[1].trim();
    const vector = vectorString.split(',').map(Number);

    // Initialize an empty array to store the attributes
    const attributes = [];

    // Loop through the vector and attribute list
    for (let i = 0; i < vector.length; i++) {
        if (vector[i] === 1) {
            // If the value at the index i of vector is 1, add the corresponding attribute
            attributes.push(attributeList[i]);
        }
    }

    // Log the attributes
    console.log("Attributes:", attributes);
};

// Test the function with Youkai Watch's vector string
const youkaiWatchDebugString = "[Debug] Youkai Watch's Vector: 1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
debugVectorToAttributes(youkaiWatchDebugString, combinedList);