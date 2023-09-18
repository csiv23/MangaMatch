import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    background: linear-gradient(45deg, #20002c 30%, #0e001f 90%);
    color: white;

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
    }

    .btn {
        font-size: 1rem;
        padding: 0.5rem 2rem;
        background-color: #800080;
        border: none;
        color: white;
        border-radius: 4px;

        &:hover {
            background-color: #993399;
        }
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
        <WelcomeContainer>
            <h1>Welcome to MangaMatch</h1>
            <p>Find the best manga recommendations tailored for you!</p>
            <button className="btn btn-primary" onClick={handleClick}>Start</button>
        </WelcomeContainer>
    );
}

export default WelcomeScreen;
