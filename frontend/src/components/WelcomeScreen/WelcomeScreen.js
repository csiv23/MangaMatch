import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';
import 'font-awesome/css/font-awesome.min.css';

function WelcomeScreen() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/select-manga');
    };

    return (
        <div className="welcome-container">
            <div className="header">
                <h1>MangaMatch</h1>
                <div className="logo">
                    <i className="fa fa-book" aria-hidden="true"></i>
                </div>
            </div>
            <p>Find the best manga recommendations tailored for you!</p>
            <button className="btn btn-primary" onClick={handleClick}>Start</button>
        </div>
    );
}

export default WelcomeScreen;
