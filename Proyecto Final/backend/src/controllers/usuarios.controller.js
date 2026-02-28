const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const usuariosRepository = require('../repositories/usuarios.repository');
const { UsuarioDomain } = require('../domain/validations');

const usuarioDomain = new UsuarioDomain();

class UsuariosController {
  register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    usuarioDomain.validateEmail(email);
    usuarioDomain.validatePassword(password);

    const existingUser = await usuariosRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('El email ya está registrado');
      error.status = 409;
      throw error;
    }

    const hashedPassword = await usuarioDomain.hashPassword(password);
    const user = await usuariosRepository.create(email, hashedPassword, 'user');

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: { id: user.id, email: user.email, role: user.role },
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    usuarioDomain.validateEmail(email);

    const user = await usuariosRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    const isPasswordValid = await usuarioDomain.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  });

  logout = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logout exitoso',
    });
  });

  getProfile = asyncHandler(async (req, res) => {
    const user = await usuariosRepository.findById(req.user.id);

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    res.json({
      success: true,
      user,
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const updates = {};

    if (email) {
      usuarioDomain.validateEmail(email);
      const existingUser = await usuariosRepository.findByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        const error = new Error('El email ya está registrado');
        error.status = 409;
        throw error;
      }
      updates.email = email;
    }

    if (password) {
      usuarioDomain.validatePassword(password);
      updates.password = await usuarioDomain.hashPassword(password);
    }

    const user = await usuariosRepository.update(req.user.id, updates);

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user,
    });
  });

  deleteProfile = asyncHandler(async (req, res) => {
    await usuariosRepository.delete(req.user.id);

    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Cuenta eliminada exitosamente',
    });
  });
}

module.exports = new UsuariosController();
