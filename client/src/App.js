import React from 'react';
import { MangaProvider } from './components/MangaContext'; 
import SearchBar from './components/SearchBar'; 
import ResponseDisplay from './components/ResponseDisplay'; 
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
