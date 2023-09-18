import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MangaContext } from '../../contexts/MangaContext';

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
            <h2>Ready to find your next favorite manga?</h2>
            {loading && (
                <div className="loading-indicator">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="sr-only"></span>
                    </div>
                    <span> Generating recommendations...</span>
                </div>
            )}
            {showNextButton && !loading && (
                <button className="btn btn-primary" onClick={() => navigate('/view-recommendations')}>
                    Next
                </button>
            )}
        </div>
    );
}

export default RecommendationScreen;
