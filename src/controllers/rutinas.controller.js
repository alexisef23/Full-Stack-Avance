const aiService = require('../services/gemini.js');

const crearRutinaIA = async (req, res) => {
    try {
        const { objetivo, nivel, dias } = req.body;
        if (!objetivo || !nivel || !dias) {
            return res.status(400).json({ message: "Faltan datos (objetivo, nivel, dias)" });
        }

        const rutinaGenerada = await aiService.generarRutina(objetivo, nivel, dias);
        res.json({ 
            mensaje: "Rutina generada con éxito",
            source: "Gemini AI 1.5 Flash", 
            rutina: rutinaGenerada 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crearRutinaIA };