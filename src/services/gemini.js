const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generarRutina = async (objetivo, nivel, dias) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
            Actúa como un entrenador personal experto.
            Genera una rutina de ejercicios para una persona con las siguientes características:
            - Objetivo: ${objetivo}
            - Nivel: ${nivel}
            - Días disponibles: ${dias}
            
            El formato de salida debe ser ESTRICTAMENTE este esquema JSON (un array de objetos): 
            [
                {
                    "dia": "Lunes",
                    "musculo": "Pecho",
                    "ejercicios": ["Press Banca", "Aperturas"]
                }
            ]
        `;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        return JSON.parse(responseText);

    } catch (error) {
        console.error("Error en Gemini Service:", error.message);
        throw new Error("Error al generar la rutina con IA. Intenta de nuevo más tarde.");
    }
};

module.exports = { generarRutina };