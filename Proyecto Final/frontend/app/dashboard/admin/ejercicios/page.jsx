'use client';

import { useEffect, useMemo, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/lib/useAuth';

export default function AdminEjerciciosPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ nombre: '', musculo: 'pecho' });

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const fetchPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/ejercicios', { params: { page, limit: 10 } });
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) {
      setError(e.response?.data?.message || 'No se pudo cargar el catálogo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const createEjercicio = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await apiClient.post('/ejercicios', form);
      setForm({ nombre: '', musculo: 'pecho' });
      await fetchPage();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creando ejercicio');
    }
  };

  const deleteEjercicio = async (id) => {
    if (!confirm('¿Eliminar ejercicio?')) return;
    setError(null);
    try {
      await apiClient.delete(`/ejercicios/${id}`);
      await fetchPage();
    } catch (err) {
      setError(err.response?.data?.message || 'Error eliminando ejercicio');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="card border-2 border-red-500">
          <h1 className="text-3xl font-bold text-red-300 mb-2">Acceso denegado</h1>
          <p className="text-slate-300">Necesitas rol admin para administrar el catálogo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold text-neon-purple">Admin · Catálogo de Ejercicios</h1>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card border-2 border-neon-purple">
          <h2 className="text-xl font-bold text-neon-purple mb-4">Crear ejercicio</h2>
          <form onSubmit={createEjercicio} className="space-y-3">
            <div>
              <label className="block text-slate-300 mb-2">Nombre</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-neon-purple"
                placeholder="Ej. Press de banca"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Músculo</label>
              <select
                value={form.musculo}
                onChange={(e) => setForm((p) => ({ ...p, musculo: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-neon-purple"
              >
                {['pecho', 'espalda', 'piernas', 'glúteos', 'hombro', 'bíceps', 'tríceps', 'core', 'cardio'].map(
                  (m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  )
                )}
              </select>
            </div>

            <button className="btn-secondary w-full" type="submit">
              Crear
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neon-blue">Listado</h2>
            {pagination && (
              <div className="text-slate-400 text-sm">
                Página {pagination.page} de {pagination.pages}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-neon-blue">Cargando...</div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="card border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-100">{it.nombre}</div>
                    <div className="text-slate-400 text-sm">{it.musculo}</div>
                  </div>
                  <button
                    onClick={() => deleteEjercicio(it.id)}
                    className="px-3 py-2 bg-red-900/20 text-red-400 border border-red-500 rounded hover:bg-red-900/40 transition"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-outline disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

