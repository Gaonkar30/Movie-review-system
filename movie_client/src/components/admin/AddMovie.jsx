import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './AddMovie.css';

const AddMovie = () => {
    const navigate = useNavigate();
    const [movie, setMovie] = useState({
        imdbId: '',
        title: '',
        releaseDate: '',
        trailerLink: '',
        poster: '',
        genres: '',
        backdrops: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'genres' || name === 'backdrops') {
            // Convert comma-separated string to array
            setMovie({
                ...movie,
                [name]: value.split(',').map(item => item.trim())
            });
        } else {
            setMovie({
                ...movie,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/v1/movies', movie);
            navigate('/'); // Redirect to home page after successful creation
        } catch (error) {
            console.error('Error creating movie:', error);
        }
    };

    return (
        <div className="add-movie-container">
            <h2>Add New Movie</h2>
            <form onSubmit={handleSubmit} className="add-movie-form">
                <div className="form-group">
                    <label>IMDB ID:</label>
                    <input
                        type="text"
                        name="imdbId"
                        value={movie.imdbId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={movie.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Release Date:</label>
                    <input
                        type="text"
                        name="releaseDate"
                        value={movie.releaseDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Trailer Link:</label>
                    <input
                        type="text"
                        name="trailerLink"
                        value={movie.trailerLink}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Poster URL:</label>
                    <input
                        type="text"
                        name="poster"
                        value={movie.poster}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Genres (comma-separated):</label>
                    <input
                        type="text"
                        name="genres"
                        value={movie.genres}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Backdrops (comma-separated URLs):</label>
                    <input
                        type="text"
                        name="backdrops"
                        value={movie.backdrops}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Add Movie</button>
            </form>
        </div>
    );
};

export default AddMovie; 