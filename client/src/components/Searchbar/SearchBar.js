import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MangaContext } from '../../contexts/MangaContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import MangaSuggestions from './MangaSuggestions';
import SelectedMangaList from './SelectedMangaList';

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

            <SelectedMangaList selectedMangaTitles={selectedMangaTitles} handleRemoveManga={handleRemoveManga} />
            <MangaSuggestions suggestions={suggestions} handleSelectManga={handleSelectManga} />
        </div>
    );
}

export default SearchBar;
