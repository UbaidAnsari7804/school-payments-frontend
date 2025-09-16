import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  useEffect(() => {
    // attach token to axios
    api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, [token]);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const access = res.data?.access_token || res.data?.token || null;
    if (!access) throw new Error('Login failed: no token');
    setToken(access);
    localStorage.setItem('token', access);
    // optional set user
    const u = res.data?.user ?? { username };
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    return u;
  };

  const register = async (username, password) => {
    const res = await api.post('/auth/register', { username, password });
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
