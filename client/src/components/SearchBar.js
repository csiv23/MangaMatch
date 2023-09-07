// SearchBar.js

import React, { useState } from 'react';

function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedMangaId, setSelectedMangaId] = useState(null);

    const handleSearch = async () => {
        try {
            // Fetch recommendations using the selectedMangaId
            if (selectedMangaId) { // Ensure a manga has been selected before fetching
                const response = await fetch(`http://localhost:5000/api/recommend/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mangaIds: [selectedMangaId] }) // Pass the selectedMangaId in the body
                });
                const data = await response.json();
                console.log(data);
            }
        } catch (error) {
            console.error('Error fetching the recommendations:', error);
        }
    };


    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`/api/search/suggestions?title=${query}`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    fetchSuggestions(e.target.value); // Consider debouncing this call
                }}
                placeholder="Enter manga title..."
            />
            {/* Display suggestions and allow users to select a suggestion */}
            {suggestions.length > 0 && (
                <div>
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.manga_id} // Use manga_id as key
                            onClick={() => {
                                setQuery(suggestion.title);
                                setSelectedMangaId(suggestion.manga_id); // Set manga_id to selectedMangaId
                                setSuggestions([]);
                            }}
                        >
                            {suggestion.title} - {suggestion.info}
                        </div>
                    ))}
                </div>
            )}
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}

export default SearchBar;
