'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export default function HistoryPage() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchHistorial();
  }, [page]);

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/historial', {
        params: { page, limit: 20 },
      });
      setHistorial(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Error al cargar historial');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) return;

    try {
      await apiClient.delete(`/historial/${id}`);
      fetchHistorial();
    } catch (err) {
      setError('Error al eliminar entrenamiento');
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-neon-blue mb-8">Mi Historial de Entrenamientos</h1>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-neon-blue">Cargando...</div>
      ) : historial.length === 0 ? (
        <div className="card border-2 border-slate-700 text-center">
          <p className="text-slate-400">No hay entrenamientos registrados aún.</p>
          <p className="text-slate-500 text-sm mt-2">Dirígete al dashboard y registra tu primer entrenamiento</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {historial.map((entrenamiento) => (
              <div key={entrenamiento.id} className="card border-2 border-slate-700 hover:border-neon-blue transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neon-blue">
                      {entrenamiento.ejercicio_nombre}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">{entrenamiento.musculo}</p>

                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-slate-400 text-xs">Fecha</p>
                        <p className="text-neon-purple font-bold">{entrenamiento.fecha}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Series</p>
                        <p className="text-neon-blue font-bold">{entrenamiento.series}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Reps</p>
                        <p className="text-neon-blue font-bold">{entrenamiento.reps}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Peso</p>
                        <p className="text-neon-blue font-bold">{entrenamiento.peso}kg</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(entrenamiento.id)}
                    className="ml-4 px-3 py-2 bg-red-900/20 text-red-400 border border-red-500 rounded hover:bg-red-900/40 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-outline disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-slate-400">
                Página {page} de {pagination.pages}
              </span>
              <button
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="btn-outline disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
