import React from 'react';

function MangaSuggestions({ suggestions, handleSelectManga }) {
    return (
        suggestions.length > 0 && (
            <div className="list-group">
                {suggestions.map((suggestion) => (
                    <button
                        type="button"
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        key={suggestion.manga_id}
                        onClick={() => handleSelectManga(suggestion)}
                    >
                        {/* Display manga main picture next to the suggestion */}
                        <img src={suggestion.main_picture} alt={`${suggestion.title} cover`} style={{ width: '50px', marginRight: '10px' }} />
                        {suggestion.title}{suggestion.info ? ` - ${suggestion.info}` : ''}
                    </button>
                ))}
            </div>
        )
    );
}

export default MangaSuggestions;
