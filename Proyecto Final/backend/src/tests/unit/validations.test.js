const { UsuarioDomain, EjercicioDomain, HistorialDomain } = require('../../domain/validations');

describe('UsuarioDomain', () => {
  let usuarioDomain;

  beforeEach(() => {
    usuarioDomain = new UsuarioDomain();
  });

  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(() => usuarioDomain.validateEmail('user@example.com')).not.toThrow();
    });

    it('should throw error for invalid email', () => {
      expect(() => usuarioDomain.validateEmail('invalid-email')).toThrow('El email no es válido');
    });
  });

  describe('validatePassword', () => {
    it('should validate password with at least 6 characters', () => {
      expect(() => usuarioDomain.validatePassword('password123')).not.toThrow();
    });

    it('should throw error for short password', () => {
      expect(() => usuarioDomain.validatePassword('short')).toThrow(
        'La contraseña debe tener al menos 6 caracteres'
      );
    });
  });
});

describe('EjercicioDomain', () => {
  let ejercicioDomain;

  beforeEach(() => {
    ejercicioDomain = new EjercicioDomain();
  });

  describe('validateNombre', () => {
    it('should validate valid exercise name', () => {
      expect(() => ejercicioDomain.validateNombre('Press de Banca')).not.toThrow();
    });

    it('should throw error for short name', () => {
      expect(() => ejercicioDomain.validateNombre('ab')).toThrow();
    });
  });
});

describe('HistorialDomain', () => {
  let historialDomain;

  beforeEach(() => {
    historialDomain = new HistorialDomain();
  });

  describe('validateEntrenamiento', () => {
    it('should validate correct training data', () => {
      expect(() =>
        historialDomain.validateEntrenamiento(3, 10, 100, '2024-02-27')
      ).not.toThrow();
    });

    it('should throw error for invalid series', () => {
      expect(() =>
        historialDomain.validateEntrenamiento(0, 10, 100, '2024-02-27')
      ).toThrow();
    });
  });
});
