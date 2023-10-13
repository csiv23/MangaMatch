import React from 'react';
import './MangaSuggestions.css'; 

function MangaSuggestions({ suggestions, handleSelectManga }) {
    return (
        suggestions.length > 0 && (
            <div className="list-group manga-suggestions-container">
                {suggestions.map((suggestion) => (
                    <button
                        type="button"
                        className="list-group-item list-group-item-action d-flex align-items-center suggestion-item" // Added 'suggestion-item' classname
                        key={suggestion.manga_id}
                        onClick={() => handleSelectManga(suggestion)}
                    >
                        <img src={suggestion.main_picture} alt={`${suggestion.title} cover`} className="suggestion-img" />
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
