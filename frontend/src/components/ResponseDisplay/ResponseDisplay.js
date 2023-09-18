import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MangaContext } from '../../contexts/MangaContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ResponseDisplay.css';

function ResponseDisplay() {
    const { responseData } = useContext(MangaContext);

    return (
        <div className="container mt-3">
            <Link to="/" className="btn btn-secondary mb-3">Back to Search</Link>
            <div className="d-flex flex-wrap justify-content-around">
                {responseData.map((manga, index) => {
                    console.log(`Genres type: ${typeof manga.genres}`, manga.genres);

                    // Parse the genres string to get an array and join it to get a string
                    let genresList = 'Undefined';
                    let genresLabel = 'Genres';
                    if (manga.genres && manga.genres.length > 0) {
                        try {
                            const genresArray = JSON.parse(manga.genres[0].replace(/'/g, '"'));
                            genresList = genresArray.join(', ');
                            genresLabel = genresArray.length === 1 ? 'Genre' : 'Genres';
                        } catch (error) {
                            console.error('Error processing genres:', error);
                        }
                    }
                    // Process authors to get a string representation and determine the appropriate label
                    let authorsList = 'Undefined';
                    let authorsLabel = 'Authors';
                    if (manga.authors && manga.authors.length > 0) {
                        try {
                            authorsList = manga.authors
                                .map(authorString => {
                                    const authorArray = JSON.parse(authorString.replace(/'/g, '"'));
                                    return authorArray
                                        .map(author => `${author.first_name} ${author.last_name}`.trim())
                                        .join(', ');
                                })
                                .join(', ');

                            authorsLabel = manga.authors.length === 1 ? 'Author' : 'Authors';
                        } catch (error) {
                            console.error('Error processing authors:', error);
                        }
                    }

                    return (
                        <div className="card m-2" style={{ width: '18rem' }} key={index}>
                            <img src={manga.main_picture} alt={`${manga.title} cover`} className="card-img-top manga-image" />
                            <div className="card-body manga-text">
                                <h5 className="card-title">{manga.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{manga.type} - Score: {manga.score}</h6>
                                <p className="card-text">
                                    {genresLabel}: {genresList} <br />
                                    {authorsLabel}: {authorsList}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ResponseDisplay;


