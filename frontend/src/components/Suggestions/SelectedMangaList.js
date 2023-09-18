import React from 'react';

function SelectedMangaList({ selectedMangaTitles = [], handleRemoveManga }) {
    return (
        selectedMangaTitles.length > 0 && (
            <div className="d-flex flex-wrap mb-3" style={{ gap: '8px' }}>
                {selectedMangaTitles.map((title, index) => (
                    <div 
                        key={index} 
                        className="d-flex justify-content-between align-items-center px-2 py-1"
                        style={{ 
                            background: '#f0f0f0', 
                            borderRadius: '12px', 
                            maxWidth: '48%', 
                            fontSize: '0.9em' 
                        }}
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
