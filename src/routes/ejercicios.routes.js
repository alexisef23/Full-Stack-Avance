const express = require('express');
const router = express.Router();
const controller = require('../controllers/ejercicios.controller');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');
const { obtenerRecomendacionIA } = require('../services/gemini');
const asyncHandler = require('../utils/asyncHandler');

router.get('/recomendacion/:musculo', verifyToken, asyncHandler(async (req, res) => {
    const recomendacion = await obtenerRecomendacionIA(req.params.musculo);
    res.json({ recomendacion });
}));

router.get('/', verifyToken, controller.getAllEjercicios);
router.post('/', verifyToken, controller.createEjercicio);
router.delete('/:id', verifyToken, verifyRole('admin'), controller.deleteEjercicio);

module.exports = router;