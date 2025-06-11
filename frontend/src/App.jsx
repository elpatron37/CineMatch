import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useToken from './useToken';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Discover from './components/Discover'; 
import SimpleSearch from './components/SimpleSearch'; 
import Liked from './components/Liked';
import Profile from './components/Profile';
import LoginSignup from './components/LoginSignup';
import MovieDetail from './components/MovieDetail';

import './styles/App.css';

function App() {
  const { token, setToken, removeToken } = useToken();
  const isAuthenticated = !!token;

  const handleLogout = () => {
    removeToken();
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:movieId" element={isAuthenticated ? <MovieDetail token={token} /> : <Navigate to="/login" />} />
          
          {/* Updated and New Search Routes */}
          <Route path="/discover" element={isAuthenticated ? <Discover token={token} /> : <Navigate to="/login" />} />
          <Route path="/search" element={isAuthenticated ? <SimpleSearch token={token} /> : <Navigate to="/login" />} />
          
          <Route path="/liked" element={isAuthenticated ? <Liked token={token} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile token={token} logout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginSignup onAuth={setToken} /> : <Navigate to="/profile" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;