
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar({ isAuthenticated }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <NavLink to="/">CineMatch</NavLink> 
      </div>
      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        {isAuthenticated && <NavLink to="/search">Search</NavLink>}
        {isAuthenticated && <NavLink to="/discover">Discover</NavLink>}
        {isAuthenticated && <NavLink to="/liked">My List</NavLink>}
      </div>
      <div className="nav-profile">
        {isAuthenticated ? (
          <NavLink to="/profile">Profile</NavLink>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  );
}