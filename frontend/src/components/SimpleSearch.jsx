import { useState } from 'react';
import MovieCard from './MovieCard';
import '../styles/search.css'; // We can reuse the same styles

export default function SimpleSearch({ token }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSearched(true);
    // HIT THE NEW ENDPOINT
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/simple-search/?q=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setResults(data);
    setIsLoading(false);
  };

  return (
    <div className="container">
      <h1>Search by Title</h1>
      <p>Find movies and TV shows by their name.</p>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., The Matrix, Breaking Bad..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && !isLoading && results.length === 0 && (
        <p>No results found for "{query}".</p>
      )}

      <div className="movie-grid">
        {results.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}