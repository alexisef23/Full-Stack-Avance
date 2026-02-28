const bcrypt = require('bcryptjs');

class UsuarioDomain {
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      const error = new Error('El email no es válido');
      error.status = 400;
      throw error;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('El email no es válido');
      error.status = 400;
      throw error;
    }
  }

  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      const error = new Error('La contraseña debe tener al menos 6 caracteres');
      error.status = 400;
      throw error;
    }
    if (password.length < 6) {
      const error = new Error('La contraseña debe tener al menos 6 caracteres');
      error.status = 400;
      throw error;
    }
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

class EjercicioDomain {
  validateNombre(nombre) {
    if (!nombre || nombre.trim().length < 3) {
      const error = new Error('El nombre del ejercicio debe tener al menos 3 caracteres');
      error.status = 400;
      throw error;
    }
  }

  validateMusculo(musculo) {
    if (!musculo || typeof musculo !== 'string') {
      const error = new Error('El músculo es requerido');
      error.status = 400;
      throw error;
    }

    const allowed = [
      'pecho',
      'espalda',
      'piernas',
      'glúteos',
      'hombro',
      'bíceps',
      'tríceps',
      'core',
      'cardio',
    ];

    const normalized = musculo.trim().toLowerCase();
    if (!allowed.includes(normalized)) {
      const error = new Error(
        `El músculo debe ser uno de: ${allowed.join(', ')}`
      );
      error.status = 400;
      throw error;
    }
  }
}

class HistorialDomain {
  validateEntrenamiento(series, reps, peso, fecha) {
    if (series === undefined || series === null || Number.isNaN(Number(series))) {
      const error = new Error('Las series deben estar entre 1 y 100');
      error.status = 400;
      throw error;
    }
    if (Number(series) < 1 || Number(series) > 100) {
      const error = new Error('Las series deben estar entre 1 y 100');
      error.status = 400;
      throw error;
    }

    if (reps === undefined || reps === null || Number.isNaN(Number(reps))) {
      const error = new Error('Las repeticiones deben estar entre 1 y 1000');
      error.status = 400;
      throw error;
    }
    if (Number(reps) < 1 || Number(reps) > 1000) {
      const error = new Error('Las repeticiones deben estar entre 1 y 1000');
      error.status = 400;
      throw error;
    }

    if (peso === undefined || peso === null || Number.isNaN(Number(peso))) {
      const error = new Error('El peso debe estar entre 0 y 9999.99 kg');
      error.status = 400;
      throw error;
    }
    if (Number(peso) < 0 || Number(peso) > 9999.99) {
      const error = new Error('El peso debe estar entre 0 y 9999.99 kg');
      error.status = 400;
      throw error;
    }

    if (!fecha) {
      const error = new Error('La fecha es requerida');
      error.status = 400;
      throw error;
    }

    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      const error = new Error('La fecha no es válida');
      error.status = 400;
      throw error;
    }

    if (fechaObj > new Date()) {
      const error = new Error('No se pueden registrar entrenamientos en el futuro');
      error.status = 400;
      throw error;
    }
  }
}

module.exports = {
  UsuarioDomain,
  EjercicioDomain,
  HistorialDomain,
};
