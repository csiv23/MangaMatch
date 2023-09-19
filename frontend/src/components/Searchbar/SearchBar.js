import React, { useState, useContext, useEffect } from 'react';
import { MangaContext } from '../../contexts/MangaContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import MangaSuggestions from '../Suggestions/MangaSuggestions';
import SelectedMangaList from '../Suggestions/SelectedMangaList';
import './Searchbar.css';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const {
        selectedMangaIds, setSelectedMangaIds,
        selectedMangaTitles, setSelectedMangaTitles
    } = useContext(MangaContext);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const navigate = useNavigate();

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
        if (suggestion && suggestion.manga_id !== undefined && suggestion.title !== undefined) {
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
            setQuery('');
            setSuggestions([]);
        } else {
            console.error('Suggestion object is missing necessary properties', suggestion);
        }
    };

    useEffect(() => {
        fetchSuggestions('a'); // Fetch suggestions with an empty query string on component mount
    }, []); // Empty dependency array to ensure it runs only once on mount


    return (
        <div className="search-bar">
            <h2 className="text-center">Search Manga You Want Suggestions For:</h2>

            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        fetchSuggestions(e.target.value);
                    }}
                    placeholder="Enter manga title..."
                    aria-label="Manga title"
                />
            </div>

            {suggestions.length > 0 && <MangaSuggestions suggestions={suggestions} handleSelectManga={handleSelectManga} />} {/* Changed the condition to check suggestions array length */}

            <SelectedMangaList selectedMangaTitles={selectedMangaTitles} handleRemoveManga={handleRemoveManga} />

            <div className="text-center">
                <button className="next-button" onClick={() => navigate('/recommendation-screen')}>
                    Next
                </button>
            </div>
        </div>
    );


}


export default SearchBar;
