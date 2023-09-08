import React, { createContext, useState } from 'react';

export const MangaContext = createContext();

export function MangaProvider({ children }) {
    const [responseData, setResponseData] = useState([]);

    return (
        <MangaContext.Provider value={{ responseData, setResponseData }}>
            {children}
        </MangaContext.Provider>
    );
}
