// jsonHelper.js

// Function to correct JSON string
function correctJsonString(str) {
    if (typeof str !== 'string') {
        console.error('Input is not a string:', str);
        return '';
    }
    return str.replace(/'/g, '"');
}

/**
 * Function to safely parse any JSON string
 * 
 * @param {string} input - The JSON string to parse
 * @param {any} defaultValue - The value to return if parsing fails
 * @returns {any} - Parsed JSON or defaultValue
 */
function safeParseJSON(input, defaultValue) {
    if (typeof input !== 'string') {
        console.error('Input is not a string:', input);
        return defaultValue;
    }

    try {
        return JSON.parse(correctJsonString(input));
    } catch (err) {
        console.error('Error parsing JSON:', err);
        return defaultValue;
    }
}

module.exports = {
    correctJsonString,
    safeParseJSON
};
