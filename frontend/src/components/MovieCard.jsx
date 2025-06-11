import { Link } from 'react-router-dom'; 
import '../styles/movie-card.css';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/500x750.png?text=No+Poster';

export default function MovieCard({ movie }) {
  const posterSrc = movie.poster_url 
    ? `${POSTER_BASE_URL}${movie.poster_url}` 
    : PLACEHOLDER_IMAGE;

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <img src={posterSrc} alt={`${movie.title} poster`} />
        <div className="movie-card-info">
          <h3>{movie.title}</h3>
        </div>
      </div>
    </Link>
  );
}