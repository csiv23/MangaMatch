import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MangaContext } from '../../contexts/MangaContext';
import './RecommendationScreen.css';
import { FaArrowRight } from 'react-icons/fa'; // Import the arrow icon



function RecommendationScreen() {
    const navigate = useNavigate();
    const { setResponseData, selectedMangaIds } = useContext(MangaContext);
    const [loading, setLoading] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);

    const handleGenerateRecommendations = async () => {
        try {
            console.log('Starting recommendation generation...');
            console.log('Selected Manga IDs:', selectedMangaIds);

            setLoading(true);
            if (selectedMangaIds.length > 0) {
                const response = await fetch(`http://localhost:5000/api/recommend/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mangaIds: selectedMangaIds })
                });
                const data = await response.json();
                console.log('Received data:', data);
                setResponseData(data);
                setLoading(false);
                setShowNextButton(true);
            } else {
                console.warn('No manga IDs selected');
            }
        } catch (error) {
            console.error('Error fetching the recommendations:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGenerateRecommendations();
    }, []);  // Empty dependencies array means this effect runs once when component mounts

    return (
        <div className="recommendation-screen">
            {loading && (
                <div className="loading-indicator">
                    <div className="generate-recommendation-text">Generating recommendations...</div>
                    <div className="spinner-border text-secondary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {showNextButton && !loading && (
                <button className="show-recommendations-btn" onClick={() => navigate('/view-recommendations')}>
                    Show Recommendations <FaArrowRight className="arrow-icon" />
                </button>
            )}
        </div>
    );
}

export default RecommendationScreen;
