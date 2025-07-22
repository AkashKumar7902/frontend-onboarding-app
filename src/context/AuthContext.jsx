import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Get initial state from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [permissions, setPermissions] = useState(() => {
    const saved = localStorage.getItem('permissions');
    return saved ? JSON.parse(saved) : [];
  });


  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      
      // Destructure the new, richer payload
      const { token: newToken, user: newUser, tenant: newTenant } = response.data;
      setToken(newToken);
      setUser(newUser);
      setPermissions(newTenant.enabledEntities); // <-- Set the permissions

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('permissions', JSON.stringify(newTenant.enabledEntities)); // <-- Store permissions

      navigate('/dashboard');
      return true;
    } catch (error) {

      console.error('Login failed:', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null); // <-- Clear the user object
    setPermissions([]); // <-- Clear permissions on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // <-- Clear user from storage
    localStorage.removeItem('permissions'); // <-- Clear permissions from storage
    navigate('/login');
  };

  const isAuthenticated = !!token;

  // Add the user object to the context value
  const value = {
    isAuthenticated,
    user, // <-- Expose user object
    permissions, 
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// This is a custom hook that simplifies using our AuthContext.
// Instead of importing and using useContext(AuthContext) in every component,
// we can just call useAuth().
export const useAuth = () => {
  return useContext(AuthContext);
};
