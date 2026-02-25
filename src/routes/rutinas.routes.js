const express = require('express');
const router = express.Router();
const controller = require('../controllers/rutinas.controller');

router.post('/generar', controller.crearRutinaIA);
module.exports = router;