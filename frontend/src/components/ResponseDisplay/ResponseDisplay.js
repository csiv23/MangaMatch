import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { MangaContext } from '../../contexts/MangaContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResponseDisplay.css';

function ResponseDisplay() {
    const { responseData, setSelectedManga, setSelectedMangaIds } = useContext(MangaContext);

    const location = useLocation();

    const handleBackToSearch = () => {
        setSelectedManga([]);  // Reset the selected manga to an empty array
        setSelectedMangaIds([]);  // Reset the selected manga IDs to an empty array
        location.push('/');
    };

    return (
        <div className="container mt-3">
            <Link to="/" className="btn btn-secondary mb-3" onClick={handleBackToSearch}>
                Back to Search
            </Link>
            <div className="d-flex flex-wrap justify-content-around">
                {responseData.map((manga, index) => {
                    return (
                        <div className="card m-2" style={{ width: '18rem' }} key={index}>
                            <img src={manga.main_picture} alt={`${manga.title} cover`} className="card-img-top manga-image" />
                            <div className="card-body manga-text">
                                <h5 className="card-title mb-2">
                                    <a href={manga.url} target="_blank" rel="noopener noreferrer">{manga.title}</a>
                                </h5>
                                <h6 className="card-subtitle mb-2 text-muted">{manga.type} - Score: {manga.score}</h6>
                                <p className="card-text">
                                    {manga.synopsis}
                                </p>
                                {/* Add a link to MyAnimeList */}
                                <a href={manga.url} target="_blank" rel="noopener noreferrer" className="mal-link">
                                    Read more on MyAnimeList
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ResponseDisplay;
