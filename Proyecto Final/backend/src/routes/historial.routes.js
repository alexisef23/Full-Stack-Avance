const express = require('express');
const historialController = require('../controllers/historial.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', historialController.getMyHistory);
router.get('/for-chat', historialController.getForChat);
router.post('/', historialController.create);
router.get('/:id', historialController.getById);
router.put('/:id', historialController.update);
router.delete('/:id', historialController.delete);

module.exports = router;
