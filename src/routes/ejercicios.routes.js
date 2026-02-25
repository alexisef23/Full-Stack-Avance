const express = require('express');
const router = express.Router();
const controller = require('../controllers/ejercicios.controller');

router.get('/', controller.getAllEjercicios);
router.post('/', controller.createEjercicio);
router.put('/:id', controller.updateEjercicio);
router.delete('/:id', controller.deleteEjercicio);

module.exports = router;