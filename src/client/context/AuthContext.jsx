import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeAccount, setActiveAccount] = useState(localStorage.getItem('activeAccount') || '1002003001');
  const [loading, setLoading] = useState(true);

  // Set default auth header for axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me');
          setUser(res.data.user);
        } catch (error) {
          console.error('Auth verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const changeActiveAccount = (accountNum) => {
    localStorage.setItem('activeAccount', accountNum);
    setActiveAccount(accountNum);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      activeAccount,
      login,
      logout,
      changeActiveAccount,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
