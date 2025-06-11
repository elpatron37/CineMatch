import { useEffect, useState } from "react";
import "../styles/profile.css";

export default function Profile({ token, logout }) {
  const [info, setInfo] = useState({ username: "", password: "" });

  useEffect(() => {
  if (token) { 
    fetch("/api/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setInfo);
  }
}, [token]);

  function handleDelete() {
    fetch("/api/delete/", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => logout());
  }

  return (
    <div className="profile">
      <img src="/anon.png" className="profile-pic" alt="profile" />
      <h2>{info.username}</h2>
      
      <button onClick={logout}>Logout</button>
      <button onClick={handleDelete} className="danger">Delete Account</button>
    </div>
  );
}
