import React, { useState, useContext } from 'react';
import { MangaContext } from '../../contexts/MangaContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import MangaSuggestions from '../Suggestions/MangaSuggestions';
import SelectedMangaList from '../Suggestions/SelectedMangaList';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook


function SearchBar() {
    const {
        selectedMangaIds, setSelectedMangaIds,
        selectedMangaTitles, setSelectedMangaTitles
    } = useContext(MangaContext);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const navigate = useNavigate(); // Define navigate using useNavigate hook

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
            setQuery(''); // Clear the search bar after selecting a manga
            setSuggestions([]); // Clear the suggestions
        } else {
            console.error('Suggestion object is missing necessary properties', suggestion);
        }
    };


    return (
        <div className="d-flex flex-column vh-100">
            <h2 className="text-center mt-4 mb-4">Input manga you want suggestions for</h2>

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
                    aria-label="Manga title"
                />
            </div>

            { query && <MangaSuggestions suggestions={suggestions} handleSelectManga={handleSelectManga} /> }

            <SelectedMangaList selectedMangaTitles={selectedMangaTitles} handleRemoveManga={handleRemoveManga} />
            
            <div className="mt-auto mb-4 text-center">
                <button className="btn btn-primary" onClick={() => navigate('/recommendation-screen')}>
                    Next
                </button>
            </div>
        </div>
    );
}


export default SearchBar;
