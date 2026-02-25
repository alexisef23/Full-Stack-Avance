'use client';
import { useState } from 'react';
import api from '@/services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });      
      Cookies.set('token', response.data.token, { expires: 1 });
      router.push('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Iniciar Sesión</h2>
        {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Contraseña</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 transition">
          Entrar
        </button>
      </form>
    </div>
  );
}