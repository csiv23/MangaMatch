import React, { createContext, useState } from 'react';

export const MangaContext = createContext();

export function MangaProvider({ children }) {
    const [responseData, setResponseData] = useState([]);
    const [selectedMangaIds, setSelectedMangaIds] = useState([]);
    const [selectedMangaTitles, setSelectedMangaTitles] = useState([]);

    return (
        <MangaContext.Provider value={{
            responseData, setResponseData,
            selectedMangaIds, setSelectedMangaIds,
            selectedMangaTitles, setSelectedMangaTitles
        }}>
            {children}
        </MangaContext.Provider>
    );
}
