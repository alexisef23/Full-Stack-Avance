const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', usuariosController.register);
router.post('/login', usuariosController.login);
router.post('/logout', authMiddleware, usuariosController.logout);
router.get('/profile', authMiddleware, usuariosController.getProfile);
router.put('/profile', authMiddleware, usuariosController.updateProfile);
router.delete('/profile', authMiddleware, usuariosController.deleteProfile);

module.exports = router;
