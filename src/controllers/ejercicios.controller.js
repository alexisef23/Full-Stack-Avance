const ejerciciosRepo = require('../repositories/ejercicios.repository');
const { validarEjercicio } = require('../domain/ejercicios.rules');
const asyncHandler = require('../utils/asyncHandler');

const getAllEjercicios = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query;        
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const usuario_id = req.user.id;

    const { data, total } = await ejerciciosRepo.findAllByUsuario(usuario_id, limit, offset);        
    
    res.json({
        data,
        pagination: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit)
        }
    });
});

const createEjercicio = asyncHandler(async (req, res) => {
    const { nombre, musculo, series, reps, peso } = req.body;
    const usuario_id = req.user.id;
    validarEjercicio({ nombre, musculo, series, reps });

    const nuevo = await ejerciciosRepo.create({ nombre, musculo, series, reps, peso, usuario_id });
    res.status(201).json({ message: `Ejercicio ${nombre} creado`, data: nuevo });
});

const deleteEjercicio = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id;

    if (isNaN(id)) {
        const err = new Error("ID inválido");
        err.statusCode = 400;
        throw err;
    }

    const borrado = await ejerciciosRepo.deleteById(id, usuario_id);

    if (!borrado) {
        const err = new Error("Ejercicio no encontrado o no autorizado para borrar");
        err.statusCode = 404;
        throw err;
    }

    res.json({ message: "Eliminado correctamente" });
});

module.exports = { getAllEjercicios, createEjercicio, deleteEjercicio };