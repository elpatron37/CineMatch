// src/components/MovieDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/MovieDetail.css';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetail({ token }) {
  const { movieId } = useParams(); // Gets the 'movieId' from the URL
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // We'll need to fetch this state

  useEffect(() => {
    // Fetch movie details
    fetch(`${process.env.REACT_APP_API_URL}/api/movie/${movieId}/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      setMovie(data);
    })
    .catch(err => setError('Failed to fetch movie details.'))
    .finally(() => setIsLoading(false));

    // Fetch liked status (we need to enhance the 'like' endpoint later for this)
    // For now, we'll just have a button
  }, [movieId, token]);
  
  const handleLike = () => {
    fetch('${process.env.REACT_APP_API_URL}/api/like/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movie.id })
    })
    .then(res => res.json())
    .then(data => {
        // Here, data is the new list of liked movies.
        // We can check if our current movie is in the list.
        const liked = data.some(m => m.id === movie.id);
        setIsLiked(liked);
    });
  }

  if (isLoading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error-message">{error}</p></div>;
  if (!movie) return null;

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-backdrop" style={{backgroundImage: `url(${POSTER_BASE_URL}${movie.poster_url})`}}></div>
      <div className="movie-detail-content container">
        <div className="movie-detail-poster">
          <img src={`${POSTER_BASE_URL}${movie.poster_url}`} alt={movie.title} />
        </div>
        <div className="movie-detail-info">
          <h1>{movie.title} <span className="release-year">({movie.release_year})</span></h1>
          
          <div className="meta-info">
            <span className="rating">Rating: {movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
            <span className="language">Language: {movie.language}</span>
          </div>
          
          <div className="genres">
            {movie.genres.map(genre => <span key={genre} className="genre-tag">{genre}</span>)}
          </div>
          
          <h3>Plot</h3>
          <p>{movie.plot}</p>
          
          <h3>Cast</h3>
          <p className="cast-list">{movie.cast.join(', ')}</p>

          <button onClick={handleLike} className={`like-button ${isLiked ? 'liked' : ''}`}>
            {isLiked ? '♥ Liked' : '♡ Like'}
          </button>
        </div>
      </div>
    </div>
  );
}