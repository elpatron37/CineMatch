import { useState } from 'react';

export default function useToken() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const saveToken = userToken => {
    if (userToken) {
      localStorage.setItem('token', userToken);
      setToken(userToken);
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  }

  return {
    setToken: saveToken,
    token,
    removeToken
  }
}