const express = require('express');
const router = express.Router();
const controller = require('../controllers/ejercicios.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/', controller.getAllEjercicios);
router.post('/', verifyToken, controller.createEjercicio);
router.put('/:id', verifyToken, controller.updateEjercicio);
router.delete('/:id', verifyToken, controller.deleteEjercicio);

module.exports = router;