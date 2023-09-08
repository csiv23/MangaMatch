import React from 'react';

function MangaSuggestions({ suggestions, handleSelectManga }) {
    return (
        suggestions.length > 0 && (
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
        )
    );
}

export default MangaSuggestions;
