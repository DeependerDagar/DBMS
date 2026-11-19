import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // LocalStorage se saved user data safely parse karo
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cineplex_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error parsing stored user data:', e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(false);

  // App start hone par default Authorization header set karo agar token exist kare
  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Login Function
  const login = (userData, authToken) => {
    // Exact user object ko save karo jisme name, email, role sab ho
    localStorage.setItem('cineplex_user', JSON.stringify(userData));
    if (authToken) {
      localStorage.setItem('token', authToken);
      setToken(authToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }
    setUser(userData);
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('cineplex_user');
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  // User Profile update helper (agar name ya details badle)
  const updateUser = (updatedData) => {
    const mergedUser = { ...user, ...updatedData };
    localStorage.setItem('cineplex_user', JSON.stringify(mergedUser));
    setUser(mergedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setLoading,
        login,
        logout,
        updateUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to consume AuthContext safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;