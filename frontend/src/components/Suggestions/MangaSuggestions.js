import React from 'react';
import './MangaSuggestions.css'; // Importing a new CSS file to style this component

function MangaSuggestions({ suggestions, handleSelectManga }) {
    return (
        suggestions.length > 0 && (
            <div className="list-group manga-suggestions-container">
                {suggestions.map((suggestion) => (
                    <button
                        type="button"
                        className="list-group-item list-group-item-action d-flex align-items-center suggestion-item" // Added a new class for styling
                        key={suggestion.manga_id}
                        onClick={() => handleSelectManga(suggestion)}
                    >
                        <img src={suggestion.main_picture} alt={`${suggestion.title} cover`} className="suggestion-img" /> {/* Added a new class for styling */}
                        <div className="suggestion-text"> {/* Wrapped text in a div to apply styles */}
                            {suggestion.title}{suggestion.info ? ` - ${suggestion.info}` : ''}
                        </div>
                    </button>
                ))}
            </div>
        )
    );
}

export default MangaSuggestions;
