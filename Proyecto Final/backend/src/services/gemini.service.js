const axios = require('axios');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async chat(userMessage, historialEntrenamientos) {
    if (!this.apiKey) {
      const error = new Error('GEMINI_API_KEY no configurada');
      error.status = 500;
      throw error;
    }

    const historialFormatted = this._formatHistorial(historialEntrenamientos);

    const systemPrompt = `Eres un entrenador de fitness motivacional y experto en deportes. Tienes acceso al historial de entrenamientos del usuario.

Historial reciente del usuario:
${historialFormatted}

Tu objetivo es:
1. Analizar el progreso del usuario basándote en su historial
2. Proporcionar feedback motivacional
3. Sugerir cuándo aumentar peso/repeticiones o cambiar ejercicios
4. Dar recomendaciones personalizadas basadas en sus datos reales

Sé conciso pero motivador. Habla como un entrenador real.`;

    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

    try {
      const response = await axios.post(url, {
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
              {
                text: userMessage,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });

      const aiMessage =
        response.data.candidates[0].content.parts[0].text ||
        'No pude generar una respuesta';

      return aiMessage;
    } catch (error) {
      console.error('Error con Gemini API:', error.response?.data || error.message);
      const err = new Error('Error al comunicarse con Gemini API');
      err.status = 500;
      throw err;
    }
  }

  _formatHistorial(historial) {
    if (!historial || historial.length === 0) {
      return 'Sin historial de entrenamientos aún.';
    }

    return historial
      .map((h) => {
        return `- ${h.fecha}: ${h.ejercicio_nombre} (${h.musculo}) - ${h.series}x${h.reps} @ ${h.peso}kg`;
      })
      .join('\n');
  }
}

module.exports = new GeminiService();
