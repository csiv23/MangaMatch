import React from 'react';

function SelectedMangaList({ selectedMangaTitles = [], handleRemoveManga }) {
    return (
        selectedMangaTitles.length > 0 && (
            <div className="selected-manga-list mb-3">
                <strong>Selected Manga:</strong>
                <ul className="list-group">
                    {selectedMangaTitles.map((title, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                            {title}
                            <button type="button" className="btn-close btn-close-black" aria-label="Close" onClick={() => handleRemoveManga(index)}></button>
                        </li>
                    ))}
                </ul>
            </div>
        )
    );
}

export default SelectedMangaList;
