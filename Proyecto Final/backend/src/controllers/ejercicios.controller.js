const asyncHandler = require('../utils/asyncHandler');
const ejerciciosRepository = require('../repositories/ejercicios.repository');
const { EjercicioDomain } = require('../domain/validations');

const ejercicioDomain = new EjercicioDomain();

class EjerciciosController {
  getAll = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const musculo = req.query.musculo || null;

    if (page < 1 || limit < 1) {
      const error = new Error('page y limit deben ser mayores a 0');
      error.status = 400;
      throw error;
    }

    const offset = (page - 1) * limit;
    const ejercicios = await ejerciciosRepository.findAll(limit, offset, musculo);
    const total = await ejerciciosRepository.countAll(musculo);

    res.json({
      success: true,
      data: ejercicios,
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
    const ejercicio = await ejerciciosRepository.findById(id);

    if (!ejercicio) {
      const error = new Error('Ejercicio no encontrado');
      error.status = 404;
      throw error;
    }

    res.json({
      success: true,
      data: ejercicio,
    });
  });

  create = asyncHandler(async (req, res) => {
    const { nombre, musculo } = req.body;

    ejercicioDomain.validateNombre(nombre);
    ejercicioDomain.validateMusculo(musculo);

    const existing = await ejerciciosRepository.findByName(nombre);
    if (existing) {
      const error = new Error('El ejercicio ya existe');
      error.status = 409;
      throw error;
    }

    const ejercicio = await ejerciciosRepository.create(nombre, musculo);

    res.status(201).json({
      success: true,
      message: 'Ejercicio creado exitosamente',
      data: ejercicio,
    });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nombre, musculo } = req.body;

    const ejercicio = await ejerciciosRepository.findById(id);
    if (!ejercicio) {
      const error = new Error('Ejercicio no encontrado');
      error.status = 404;
      throw error;
    }

    if (nombre) ejercicioDomain.validateNombre(nombre);
    if (musculo) ejercicioDomain.validateMusculo(musculo);

    const updated = await ejerciciosRepository.update(
      id,
      nombre || ejercicio.nombre,
      musculo || ejercicio.musculo
    );

    res.json({
      success: true,
      message: 'Ejercicio actualizado exitosamente',
      data: updated,
    });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ejercicio = await ejerciciosRepository.findById(id);
    if (!ejercicio) {
      const error = new Error('Ejercicio no encontrado');
      error.status = 404;
      throw error;
    }

    await ejerciciosRepository.delete(id);

    res.json({
      success: true,
      message: 'Ejercicio eliminado exitosamente',
    });
  });
}

module.exports = new EjerciciosController();
