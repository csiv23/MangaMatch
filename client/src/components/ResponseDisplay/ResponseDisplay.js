import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MangaContext } from '../../contexts/MangaContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResponseDisplay.css'; // Ensure this line is here to import your CSS

function ResponseDisplay() {
    const { responseData } = useContext(MangaContext);

    return (
        <div className="container mt-3">
            <Link to="/" className="btn btn-secondary mb-3">Back to Search</Link>
            <div className="d-flex flex-wrap justify-content-around">
                {responseData.map((manga, index) => (
                    <div className="card m-2" style={{ width: '18rem' }} key={index}>
                        <img src={manga.main_picture} alt={`${manga.title} cover`} className="card-img-top manga-image" />
                        <div className="card-body manga-text">
                            <h5 className="card-title">{manga.title}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">{manga.type} - Score: {manga.score}</h6>
                            <p className="card-text">Manga ID: {manga.manga_id}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ResponseDisplay;
