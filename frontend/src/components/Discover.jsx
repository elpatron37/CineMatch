// File: src/components/SearchBox.jsx

import { useState } from 'react';
import MovieCard from './MovieCard';
import '../styles/search.css';

export default function Discover({ token }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // 

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]); // Clear previous results
    setError(null);  // Clear previous errors

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/search/?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if the response was successful 
      if (!res.ok) {
        // If we get a 401, it means the token is bad. Give a specific message.
        if (res.status === 401) {
          setError("Your session has expired. Please log out and log in again.");
        } else {
          // For errors like 500, give  generic message.
          setError("An error occurred while searching. Please try again later.");
        }
        setIsLoading(false);
        return; 
      }
      
      const data = await res.json();
      setResults(data);

    } catch (err) {
      setError("Failed to connect to the server.");
      console.error("Search fetch error:", err);
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
      <h1>Discover</h1>
      <p>Describe a plot, a mood, or a theme to find related movies.</p>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., a space western with a stoic hero"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="error-message" style={{color: 'var(--accent-primary)'}}>{error}</p>}

      {/* 2. Show movie grid if there are results */}
      <div className="movie-grid">
        {results.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* 3. Show a "no results" message only if we are not loading, there's no error, and results are empty */}
      {!isLoading && !error && results.length === 0 && query && (
        <p>No results found for "{query}". Try a different search term.</p>
      )}
    </div>
  );
}