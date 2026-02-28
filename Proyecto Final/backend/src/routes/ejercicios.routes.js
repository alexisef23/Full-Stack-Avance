const express = require('express');
const ejerciciosController = require('../controllers/ejercicios.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', ejerciciosController.getAll);
router.get('/:id', ejerciciosController.getById);
router.post('/', authMiddleware, adminMiddleware, ejerciciosController.create);
router.put('/:id', authMiddleware, adminMiddleware, ejerciciosController.update);
router.delete('/:id', authMiddleware, adminMiddleware, ejerciciosController.delete);

module.exports = router;
