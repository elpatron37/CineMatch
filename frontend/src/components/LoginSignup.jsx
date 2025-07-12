
import { useState } from "react";
import "../styles/login.css"; 

export default function LoginSignup({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  async function handleSubmit(e) {
    e.preventDefault(); 
    setError(""); 
    
    const API_URL = process.env.REACT_APP_API_URL;
    const endpoint = isLogin ? "/api/token/" : "/api/signup/";
    const url = `${API_URL}${endpoint}`;
    const body = { username, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Auth Response:", data); // log response for debugging

      // check if the request was successful
      if (res.ok) {
        if (data.access && data.refresh) { 
          onAuth(data.access, data.refresh); 
        } else {
          // This might happen if signup is successful but doesn't return a token
          setError("Signup successful! Please log in.");
          setIsLogin(true);
        }
      } else {
        // if response is not ok, display the error from the backend
        const errorMessage = data.detail || data.error || "An unknown error occurred.";
        setError(errorMessage);
      }
    } catch (err) {
      // catches network errors
      setError("Failed to connect to the server. Is it running?");
      console.error("Fetch failed:", err);
    }
  }

  return (
    <div className="login-page-wrapper">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <p onClick={() => { setIsLogin(!isLogin); setError(""); }} className="toggle-link">
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}


