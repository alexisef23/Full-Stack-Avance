'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export default function DashboardPage() {
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedEjercicio, setSelectedEjercicio] = useState('');
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    series: '',
    reps: '',
    peso: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEjercicios();
  }, [page]);

  const fetchEjercicios = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/ejercicios', {
        params: { page, limit: 10 },
      });
      setEjercicios(response.data.data);
    } catch (err) {
      setError('Error al cargar ejercicios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedEjercicio) {
      setError('Selecciona un ejercicio');
      return;
    }

    try {
      await apiClient.post('/historial', {
        ejercicio_id: parseInt(selectedEjercicio),
        ...formData,
        series: parseInt(formData.series),
        reps: parseInt(formData.reps),
        peso: parseFloat(formData.peso),
      });

      setSuccess(true);
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        series: '',
        reps: '',
        peso: '',
      });
      setSelectedEjercicio('');

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar entrenamiento');
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="card border-2 border-neon-blue">
          <h2 className="text-2xl font-bold text-neon-blue mb-6">Registrar Entrenamiento</h2>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">
              Entrenamiento registrado exitosamente
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Ejercicio</label>
              <select
                value={selectedEjercicio}
                onChange={(e) => setSelectedEjercicio(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-neon-blue"
              >
                <option value="">Selecciona un ejercicio</option>
                {ejercicios.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.nombre} ({ex.musculo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-neon-blue"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">Series</label>
                <input
                  type="number"
                  name="series"
                  min="1"
                  max="100"
                  value={formData.series}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-neon-blue"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Reps</label>
                <input
                  type="number"
                  name="reps"
                  min="1"
                  max="1000"
                  value={formData.reps}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-neon-blue"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Peso (kg)</label>
                <input
                  type="number"
                  name="peso"
                  min="0"
                  step="0.5"
                  value={formData.peso}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-neon-blue"
                  placeholder="100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Registrando...' : 'Registrar Entrenamiento'}
            </button>
          </form>
        </div>

        {/* Información */}
        <div className="card border-2 border-neon-purple">
          <h3 className="text-2xl font-bold text-neon-purple mb-6">Bienvenido</h3>
          <p className="text-slate-300 mb-4">
            Registra tus entrenamientos en el gimnasio para que nuestra IA analize tu progreso y te haga recomendaciones personalizadas.
          </p>

          <div className="space-y-4 mt-8">
            <div className="border-l-2 border-neon-blue pl-4 py-2">
              <h4 className="text-neon-blue font-semibold">📊 Registra</h4>
              <p className="text-slate-400 text-sm">Tus entrenamientos con peso, series y repeticiones</p>
            </div>

            <div className="border-l-2 border-neon-purple pl-4 py-2">
              <h4 className="text-neon-purple font-semibold">🤖 Obtén Feedback</h4>
              <p className="text-slate-400 text-sm">Análisis inteligente de tu progreso con Gemini</p>
            </div>

            <div className="border-l-2 border-cyan-400 pl-4 py-2">
              <h4 className="text-cyan-400 font-semibold">💪 Mejora</h4>
              <p className="text-slate-400 text-sm">Recomendaciones para aumentar carga y cambiar ejercicios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
