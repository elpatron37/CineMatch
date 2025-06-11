import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import MovieCard from './MovieCard';
import '../styles/HomePage.css'; 

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/original'; 

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    fetch('/api/recommendations/')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const firstMovieWithPoster = data.find(m => m.poster_url);
          setHeroMovie(firstMovieWithPoster || data[0]);
          setMovies(data);
        }
      })
      .catch(err => console.error("Failed to fetch recommendations:", err));
  }, []);

  const heroStyle = heroMovie ? {
    backgroundImage: `url(${POSTER_BASE_URL}${heroMovie.poster_url})`
  } : {};

  return (
    <>
      {heroMovie && (
        <div className="hero-banner" style={heroStyle}>
          <div className="hero-content">
            <h1 className="hero-title">{heroMovie.title}</h1>
            <p className="hero-plot">{heroMovie.plot}</p>
            <Link to={`/movie/${heroMovie.id}`}>
              <button>More Info</button>
            </Link>
          </div>
        </div>
      )}

      <div className="container">
        <h2>Trending Now</h2>
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
}