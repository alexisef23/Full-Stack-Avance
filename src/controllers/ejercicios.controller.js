const ejerciciosRepo = require('../repositories/ejercicios.repository');

const getAllEjercicios = async (req, res) => {
    try {
        const ejercicios = await ejerciciosRepo.findAll();
        res.json(ejercicios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createEjercicio = async (req, res) => {
    try {
        const { nombre, musculo, series, reps, peso } = req.body;
        if (!nombre || !musculo) {
            return res.status(400).json({ message: "Nombre y músculo son obligatorios" });
        }
        const nuevo = await ejerciciosRepo.create({ nombre, musculo, series, reps, peso });
        res.status(201).json({ message: `Ejercicio ${nombre} creado`, data: nuevo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEjercicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, musculo, series, reps, peso } = req.body;
        
        if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

        const actualizado = await ejerciciosRepo.update(id, { nombre, musculo, series, reps, peso });
        
        if (!actualizado) return res.status(404).json({ message: "Ejercicio no encontrado" });
        
        res.json({ message: "Actualizado correctamente", data: actualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEjercicio = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

        const borrado = await ejerciciosRepo.delete(id);
        if (!borrado) return res.status(404).json({ message: "Ejercicio no encontrado" });

        res.json({ message: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllEjercicios, createEjercicio, const ejerciciosRepo = require('../repositories/ejercicios.repository');

const getAllEjercicios = async (req, res) => {
    try {
        let { page, limit } = req.query;
        
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        
        const offset = (page - 1) * limit;
        const ejercicios = await ejerciciosRepo.findAll(limit, offset);
        res.json({
            data: ejercicios,
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: ejercicios.length
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createEjercicio = async (req, res) => {
    try {
        const { nombre, musculo, series, reps, peso } = req.body;
        if (!nombre || !musculo) {
            return res.status(400).json({ message: "Nombre y músculo son obligatorios" });
        }
        const nuevo = await ejerciciosRepo.create({ nombre, musculo, series, reps, peso });
        res.status(201).json({ message: `Ejercicio ${nombre} creado`, data: nuevo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEjercicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, musculo, series, reps, peso } = req.body;
        if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

        const actualizado = await ejerciciosRepo.update(id, { nombre, musculo, series, reps, peso });
        if (!actualizado) return res.status(404).json({ message: "Ejercicio no encontrado" });
        
        res.json({ message: "Actualizado correctamente", data: actualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEjercicio = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

        const borrado = await ejerciciosRepo.delete(id);
        if (!borrado) return res.status(404).json({ message: "Ejercicio no encontrado" });

        res.json({ message: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllEjercicios, createEjercicio, updateEjercicio, deleteEjercicio };