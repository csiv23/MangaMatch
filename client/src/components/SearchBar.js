import React, { useState, useContext } from 'react'; // Added useContext here
import { useNavigate } from 'react-router-dom';
import { MangaContext } from './MangaContext'; // Adjust path as necessary
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchBar() {
    const navigate = useNavigate();
    const { setResponseData } = useContext(MangaContext);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedMangaIds, setSelectedMangaIds] = useState([]);
    const [selectedMangaTitles, setSelectedMangaTitles] = useState([]);

    const handleSearch = async () => {
        try {
            if (selectedMangaIds.length > 0) {
                const response = await fetch(`http://localhost:5000/api/recommend/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mangaIds: selectedMangaIds })
                });
                const data = await response.json();
                console.log(data);
                setResponseData(data);  // Assuming data is the fetched data
                navigate('/response');
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

    const handleRemoveManga = (index) => {
        const newSelectedMangaIds = [...selectedMangaIds];
        newSelectedMangaIds.splice(index, 1);
        setSelectedMangaIds(newSelectedMangaIds);

        const newSelectedMangaTitles = [...selectedMangaTitles];
        newSelectedMangaTitles.splice(index, 1);
        setSelectedMangaTitles(newSelectedMangaTitles);
    };

    const handleSelectManga = (suggestion) => {
        const isAlreadySelected = selectedMangaIds.includes(suggestion.manga_id);
        setSelectedMangaIds(prevSelectedMangaIds =>
            isAlreadySelected
                ? prevSelectedMangaIds.filter(id => id !== suggestion.manga_id)
                : [...prevSelectedMangaIds, suggestion.manga_id]
        );
        setSelectedMangaTitles(prevSelectedMangaTitles =>
            isAlreadySelected
                ? prevSelectedMangaTitles.filter(title => title !== suggestion.title)
                : [...prevSelectedMangaTitles, suggestion.title]
        );
        setQuery(''); // Clear the search bar after selecting a manga
        setSuggestions([]); // Clear the suggestions
    };

    return (
        <div className="container mt-3">
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        fetchSuggestions(e.target.value);
                    }}
                    placeholder="Enter manga title..."
                />
                <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {/* Display selected manga titles */}
            {selectedMangaTitles.length > 0 && (
                <div className="selected-manga-list">
                    Selected Manga:
                    {selectedMangaTitles.map((title, index) => (
                        <span key={index} className="selected-manga-item">
                            {title}
                            <button type="button" className="btn-close btn-close-black" aria-label="Close" onClick={() => handleRemoveManga(index)}></button>
                        </span>
                    ))}
                </div>
            )}

            {/* Display suggestions and allow users to select a suggestion */}
            {suggestions.length > 0 && (
                <div className="list-group">
                    {suggestions.map((suggestion) => (
                        <button
                            type="button"
                            className="list-group-item list-group-item-action"
                            key={suggestion.manga_id}
                            onClick={() => handleSelectManga(suggestion)}
                        >
                            {suggestion.title} - {suggestion.info}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
