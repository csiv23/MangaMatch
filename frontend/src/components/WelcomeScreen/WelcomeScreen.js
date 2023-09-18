import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'font-awesome/css/font-awesome.min.css';

const WelcomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    background: linear-gradient(45deg, #20002c 30%, #0e001f 90%);
    color: white;

    .header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .logo {
        font-size: 4rem;
    }

    .logo .fa {
        position: relative;
    }

    .logo .fa.fa-book {
        font-size: 4rem;
    }

    .logo .fa.fa-star {
        font-size: 1.2rem;
        position: absolute;
        top: 15%;
        left: 75%;
        color: yellow;
    }

    h1 {
        font-size: 2.5rem;
        margin: 0;
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
        .logo {
            font-size: 3rem;
        }

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
            <div className="header">
                <div className="logo">
                    <i className="fa fa-book" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                </div>
                <h1>MangaMatch</h1>
            </div>
            <p>Find the best manga recommendations tailored for you!</p>
            <button className="btn btn-primary" onClick={handleClick}>Start</button>
        </WelcomeContainer>
    );
}

export default WelcomeScreen;
