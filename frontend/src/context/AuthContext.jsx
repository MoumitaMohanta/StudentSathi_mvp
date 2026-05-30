import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/verify`);
          setUser(response.data.user);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token, API_URL]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const login = async (email, password, options = {}) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data;

      if (options.requireAdmin && userData.role !== 'admin') {
        return {
          success: false,
          message: 'This account is not an admin. Use student login or create an admin account.',
        };
      }

      if (options.requireStudent && userData.role === 'admin') {
        return {
          success: false,
          message: 'Please use Admin Login for administrator accounts.',
        };
      }

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const registerAdmin = async (firstName, lastName, email, password, adminSecret) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register/admin`, {
        firstName,
        lastName,
        email,
        password,
        adminSecret,
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Admin registration failed',
      };
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const value = {
    user,
    loading,
    token,
    darkMode,
    login,
    register,
    registerAdmin,
    logout,
    updateUser,
    toggleDarkMode,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    API_URL,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
