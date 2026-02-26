const validarEjercicio = (datos) => {
    const errores = [];

    if (!datos.nombre || datos.nombre.trim() === '') {
        errores.push("El nombre del ejercicio es obligatorio.");
    }
    if (!datos.musculo || datos.musculo.trim() === '') {
        errores.push("El grupo muscular es obligatorio.");
    }
    if (datos.series && (isNaN(datos.series) || datos.series <= 0)) {
        errores.push("Las series deben ser un número mayor a 0.");
    }
    if (datos.reps && (isNaN(datos.reps) || datos.reps <= 0)) {
        errores.push("Las repeticiones deben ser un número mayor a 0.");
    }

    if (errores.length > 0) {
        const error = new Error(errores.join(', '));
        error.statusCode = 400;
        throw error;
    }

    return true;
};

module.exports = { validarEjercicio };