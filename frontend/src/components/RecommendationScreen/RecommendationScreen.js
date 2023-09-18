import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MangaContext } from '../../contexts/MangaContext';

function RecommendationScreen() {
    const navigate = useNavigate();
    const { setResponseData, selectedMangaIds } = useContext(MangaContext);
    const [loading, setLoading] = useState(false);

    const handleGenerateRecommendations = async () => {
        try {
            console.log('Starting recommendation generation...');  // Log the start of the recommendation generation
            console.log('Selected Manga IDs:', selectedMangaIds);  // Log the manga IDs being sent in the request
            
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
                console.log('Received data:', data);  // Log the data received from the server
                setResponseData(data);
                setLoading(false);
                navigate('/view-recommendations');
            } else {
                console.warn('No manga IDs selected');  // Log a warning if no manga IDs are selected
            }
        } catch (error) {
            console.error('Error fetching the recommendations:', error);  // Log any errors
            setLoading(false);
        }
    };

    return (
        <div className="recommendation-screen">
            <h2>Ready to find your next favorite manga?</h2>
            <button className="btn btn-primary" onClick={handleGenerateRecommendations} disabled={loading}>
                Generate Recommendations
            </button>
            {loading && (
                <div className="loading-indicator">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="sr-only"></span>
                    </div>
                    <span> Generating recommendations...</span>
                </div>
            )}
        </div>
    );
}

export default RecommendationScreen;
