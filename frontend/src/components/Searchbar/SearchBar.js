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
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const navigate = useNavigate();

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`/api/search/suggestions?title=${query}&limit=6`);
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
                        if (e.target.value) {
                            fetchSuggestions(e.target.value);
                        }
                    }}
                    placeholder="Enter manga title..."
                    aria-label="Manga title"
                />
            </div>

            <div className="suggestionsAndSelectionsWrapper">
                <div className="suggestions-container">
                    {
                        suggestions.length > 0 &&
                        <MangaSuggestions
                            suggestions={windowWidth > 1024 ? suggestions.slice(0, 4) : suggestions.slice(0,5)}
                            handleSelectManga={handleSelectManga}
                        />
                    }
                </div>
            </div>

            <div className="text-center next-button-container">
                <button className="next-button" onClick={() => navigate('/recommendation-screen')}>
                    Next
                </button>
            </div>
        </div>
    );



}


export default SearchBar;
