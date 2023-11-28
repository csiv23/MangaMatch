import React from 'react';
import './SelectedMangaList.css'; // Importing a new CSS file to style this component

function SelectedMangaList({ selectedMangaTitles = [], handleRemoveManga }) {
    return (
        selectedMangaTitles.length > 0 && (
            <div className="selected-manga-container"> {/* Updated class name */}
                {selectedMangaTitles.map((title, index) => (
                    <div 
                        key={index} 
                        className="selected-manga-item"
                    >
                        <span className="text-truncate">{title}</span>
                        <button 
                            type="button" 
                            className="btn-close btn-close-black" 
                            aria-label="Close" 
                            onClick={() => handleRemoveManga(index)}
                        ></button>
                    </div>
                ))}
            </div>
        )
    );
}


export default SelectedMangaList;
