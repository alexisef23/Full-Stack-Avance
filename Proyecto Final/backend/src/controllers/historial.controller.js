const asyncHandler = require('../utils/asyncHandler');
const historialRepository = require('../repositories/historial.repository');
const ejerciciosRepository = require('../repositories/ejercicios.repository');
const { HistorialDomain } = require('../domain/validations');

const historialDomain = new HistorialDomain();

class HistorialController {
  getMyHistory = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    if (page < 1 || limit < 1) {
      const error = new Error('page y limit deben ser mayores a 0');
      error.status = 400;
      throw error;
    }

    const offset = (page - 1) * limit;
    const historial = await historialRepository.findByUsuarioId(
      req.user.id,
      limit,
      offset
    );
    const total = await historialRepository.countByUsuarioId(req.user.id);

    res.json({
      success: true,
      data: historial,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const entrenamiento = await historialRepository.findById(id);

    if (!entrenamiento || entrenamiento.usuario_id !== req.user.id) {
      const error = new Error('Entrenamiento no encontrado');
      error.status = 404;
      throw error;
    }

    res.json({
      success: true,
      data: entrenamiento,
    });
  });

  create = asyncHandler(async (req, res) => {
    const { ejercicio_id, fecha, series, reps, peso } = req.body;

    historialDomain.validateEntrenamiento(series, reps, peso, fecha);

    const ejercicio = await ejerciciosRepository.findById(ejercicio_id);
    if (!ejercicio) {
      const error = new Error('Ejercicio no encontrado');
      error.status = 404;
      throw error;
    }

    const entrenamiento = await historialRepository.create(
      req.user.id,
      ejercicio_id,
      fecha,
      series,
      reps,
      peso
    );

    res.status(201).json({
      success: true,
      message: 'Entrenamiento registrado exitosamente',
      data: entrenamiento,
    });
  });

  getForChat = asyncHandler(async (req, res) => {
    // Obtiene los últimos 30 días de historial para enviar a la IA
    const days = parseInt(req.query.days, 10) || 30;
    const historial = await historialRepository.findRecentByUsuarioId(
      req.user.id,
      days
    );

    res.json({
      success: true,
      data: historial,
    });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fecha, series, reps, peso } = req.body;

    const entrenamiento = await historialRepository.findById(id);
    if (!entrenamiento || entrenamiento.usuario_id !== req.user.id) {
      const error = new Error('Entrenamiento no encontrado');
      error.status = 404;
      throw error;
    }

    if (fecha || series || reps || peso) {
      historialDomain.validateEntrenamiento(
        series || entrenamiento.series,
        reps || entrenamiento.reps,
        peso || entrenamiento.peso,
        fecha || entrenamiento.fecha
      );
    }

    const updates = {};
    if (fecha) updates.fecha = fecha;
    if (series) updates.series = series;
    if (reps) updates.reps = reps;
    if (peso) updates.peso = peso;

    const updated = await historialRepository.update(id, req.user.id, updates);

    res.json({
      success: true,
      message: 'Entrenamiento actualizado exitosamente',
      data: updated,
    });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const entrenamiento = await historialRepository.findById(id);
    if (!entrenamiento || entrenamiento.usuario_id !== req.user.id) {
      const error = new Error('Entrenamiento no encontrado');
      error.status = 404;
      throw error;
    }

    await historialRepository.delete(id, req.user.id);

    res.json({
      success: true,
      message: 'Entrenamiento eliminado exitosamente',
    });
  });
}

module.exports = new HistorialController();
