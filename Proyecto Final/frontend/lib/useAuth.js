'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        setError('Error al cargar autenticación');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiClient.post('/usuarios/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `token=${token}; path=/; samesite=lax`;
      setUser(user);

      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Error en login';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (email, password) => {
    try {
      setError(null);
      const response = await apiClient.post('/usuarios/register', { email, password });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error en registro';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/usuarios/logout');
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; Max-Age=0; path=/';
      setUser(null);
      router.push('/auth/login');
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
