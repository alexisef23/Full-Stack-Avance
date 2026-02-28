const asyncHandler = require('../utils/asyncHandler');
const historialRepository = require('../repositories/historial.repository');
const geminiService = require('../services/gemini.service');

class ChatController {
  sendMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      const error = new Error('El mensaje no puede estar vacío');
      error.status = 400;
      throw error;
    }

    // Obtener historial reciente del usuario para contexto
    const historial = await historialRepository.findRecentByUsuarioId(
      req.user.id,
      30
    );

    // Obtener respuesta de Gemini
    const aiResponse = await geminiService.chat(message, historial);

    res.json({
      success: true,
      data: {
        userMessage: message,
        aiMessage: aiResponse,
      },
    });
  });
}

module.exports = new ChatController();
