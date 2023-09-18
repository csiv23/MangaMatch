import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomeScreen() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/select-manga');
    };

    return (
        <div className="welcome-screen">
            <h1>Welcome to MangaMatch</h1>
            <p>Find the best manga recommendations tailored for you!</p>
            <button className="btn btn-primary" onClick={handleClick}>Start</button>
        </div>
    );
}

export default WelcomeScreen;
