// Liked.jsx
import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';

export default function Liked({ token }) {
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    if (token) {
      fetch('/api/like/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setLikedMovies(data))
      .catch(err => console.error("Failed to fetch liked movies:", err));
    }
  }, [token]);

  return (
    <div className="container">
      <h1>Your Liked Movies</h1>
      {likedMovies.length > 0 ? (
        <div className="movie-grid">
          {likedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p>You haven't liked any movies yet. Start searching and add some!</p>
      )}
    </div>
  );
}