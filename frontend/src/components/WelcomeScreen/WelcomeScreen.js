import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
    text-align: center;
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 2rem;
        }

        p {
            font-size: 1rem;
        }
    }
`;

function WelcomeScreen() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/select-manga');
    };

    return (
        <WelcomeContainer className="container-fluid">
            <h1>Welcome to MangaMatch</h1>
            <p>Find the best manga recommendations tailored for you!</p>
            <button className="btn btn-primary btn-lg" onClick={handleClick}>Start</button>
        </WelcomeContainer>
    );
}

export default WelcomeScreen;
