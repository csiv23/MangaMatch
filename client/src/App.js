import React from 'react';
import { MangaProvider } from './contexts/MangaContext'; 
import SearchBar from './components/Searchbar/SearchBar'; 
import ResponseDisplay from './components/ResponseDisplay/ResponseDisplay'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <MangaProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SearchBar />} />
          <Route path="response" element={<ResponseDisplay />} />
        </Routes>
      </Router>
    </MangaProvider>
  );
}

export default App;
