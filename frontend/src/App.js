import React from 'react';
import { MangaProvider } from './contexts/MangaContext';
import SearchBar from './components/Searchbar/SearchBar';
import ResponseDisplay from './components/ResponseDisplay/ResponseDisplay';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import RecommendationScreen from './components/RecommendationScreen/RecommendationScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <MangaProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="select-manga" element={<SearchBar />} />
          <Route path="/recommendation-screen" element={<RecommendationScreen />} />
          <Route path="view-recommendations" element={<ResponseDisplay />} />
        </Routes>
      </Router>
    </MangaProvider>
  );
}

export default App;
