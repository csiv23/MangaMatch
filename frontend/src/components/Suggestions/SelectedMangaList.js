import React from 'react';
import './SelectedMangaList.css'; // Importing a new CSS file to style this component

function SelectedMangaList({ selectedMangaTitles = [], handleRemoveManga }) {
    return (
        selectedMangaTitles.length > 0 && (
            <div className="d-flex flex-wrap mb-3" style={{ gap: '8px' }}>
                {selectedMangaTitles.map((title, index) => (
                    <div 
                        key={index} 
                        className="selected-manga-item" // Added a new class for styling
                    >
                        <span className="text-truncate" style={{ maxWidth: '80%' }}>{title}</span>
                        <button 
                            type="button" 
                            className="btn-close btn-close-black" 
                            aria-label="Close" 
                            onClick={() => handleRemoveManga(index)}
                            style={{ fontSize: '1.1em' }}
                        ></button>
                    </div>
                ))}
            </div>
        )
    );
}

export default SelectedMangaList;
