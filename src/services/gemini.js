const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generarRutina = async (objetivo, nivel, dias) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            Actúa como un entrenador personal experto.
            Genera una rutina de ejercicios en formato JSON puro (sin markdown, solo el array de objetos) para una persona con:
            - Objetivo: ${objetivo}
            - Nivel: ${nivel}
            - Días disponibles: ${dias}
            
            El formato debe ser un array de objetos estrictamente así: 
            [{"dia": "Lunes", "musculo": "Pecho", "ejercicios": ["Press Banca", "Aperturas"]}]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error en Gemini Service:", error);
        throw new Error("Error al generar la rutina con IA");
    }
};

module.exports = { generarRutina };