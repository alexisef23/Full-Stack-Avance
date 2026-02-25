'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const [ejercicios, setEjercicios] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await api.get('/ejercicios'); 
        setEjercicios(response.data.data);
      } catch (err) {
        router.push('/login');
      }
    };
    fetchEjercicios();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Ejercicios</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar Sesión</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ejercicios.map((ex) => (
          <div key={ex.id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-xl">{ex.nombre}</h3>
            <p className="text-gray-600">Músculo: {ex.musculo}</p>
            <p>Series: {ex.series} | Reps: {ex.reps} | Peso: {ex.peso}</p>
          </div>
        ))}
      </div>
    </div>
  );
}