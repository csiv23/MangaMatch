// jsonHelper.js

function correctJsonString(str) {
    return str.replace(/'/g, '"');
}

function parseAuthorsString(authorStr) {
    try {
        return JSON.parse(correctJsonString(authorStr));
    } catch (err) {
        console.error("Error parsing author string:", err);
        return [];
    }
}

function safeParseJSON(input, defaultValue) {
    try {
        return JSON.parse(correctJsonString(input));
    } catch (err) {
        return defaultValue;
    }
}

module.exports = {
    correctJsonString,
    parseAuthorsString,
    safeParseJSON
};
