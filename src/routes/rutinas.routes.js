const express = require('express');
const router = express.Router();
const controller = require('../controllers/rutinas.controller');
// 1. Importar el middleware de auth (ajusta la ruta si está en otro lado)
const { verifyToken } = require('../middlewares/auth.middleware'); 

// 2. Agregarlo antes del controlador
router.post('/generar', verifyToken, controller.crearRutinaIA);

module.exports = router;