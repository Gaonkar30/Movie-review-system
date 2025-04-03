import React from 'react';
import Hero from '../hero/Hero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = ({ movies, onDeleteMovie }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="movie-page">
      <Hero movies={movies} />
      {isAdmin() && (
        <div className="admin-controls">
          <Link to="/add-movie" className="add-movie-button">Add New Movie</Link>
        </div>
      )}
      <div className="movie-grid">
        {movies?.map((movie) => (
          <div key={movie.imdbId} className="movie-card">
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <div className="movie-details">
              <h3>{movie.title}</h3>
              <div className="movie-actions">
                <Link to={`/Trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                  Watch Trailer
                </Link>
                <Link to={`/Reviews/${movie.imdbId}`}>
                  Reviews
                </Link>
                {isAdmin() && (
                  <button 
                    onClick={() => onDeleteMovie(movie.imdbId)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;