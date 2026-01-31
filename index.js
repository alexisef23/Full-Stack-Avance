const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let ejercicios = [
  {
    id: 1,
    nombre: "Sentadilla Libre",
    musculo: "Pierna",
    series: 4,
    reps: 12,
    peso: "100kg",
  },
  {
    id: 2,
    nombre: "Press de Banca",
    musculo: "Pecho",
    series: 4,
    reps: 10,
    peso: "80kg",
  },
  {
    id: 3,
    nombre: "Peso Muerto",
    musculo: "Espalda",
    series: 3,
    reps: 8,
    peso: "120kg",
  },
  {
    id: 4,
    nombre: "Press Militar",
    musculo: "Hombro",
    series: 4,
    reps: 10,
    peso: "45kg",
  },
  {
    id: 5,
    nombre: "Remo con Barra",
    musculo: "Espalda",
    series: 4,
    reps: 12,
    peso: "70kg",
  },
  {
    id: 6,
    nombre: "Curl de Bíceps",
    musculo: "Brazos",
    series: 3,
    reps: 15,
    peso: "15kg",
  },
  {
    id: 7,
    nombre: "Press Francés",
    musculo: "Brazos",
    series: 3,
    reps: 12,
    peso: "30kg",
  },
  {
    id: 8,
    nombre: "Zancadas",
    musculo: "Pierna",
    series: 3,
    reps: 20,
    peso: "25kg",
  },
  {
    id: 9,
    nombre: "Dominadas",
    musculo: "Espalda",
    series: 4,
    reps: 8,
    peso: "Corporal",
  },
  {
    id: 10,
    nombre: "Aperturas con Mancuerna",
    musculo: "Pecho",
    series: 3,
    reps: 15,
    peso: "12kg",
  }
];

app.get('/ejercicios', (req, res) => {
    res.json(ejercicios);
});

app.post('/ejercicios', (req, res) => {
    const {nombre, musculo, series, reps, peso} = req.body;
    
    const nuevoEjercicio = {
        id: ejercicios.length + 1,
        nombre,
        musculo,
        series,
        reps,
        peso,
    };

    ejercicios.push(nuevoEjercicio);
    res.status(201).json({mensaje: "Ejercicio " + nuevoEjercicio.nombre + " creado"});
});

app.put('/ejercicios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const {nombre, musculo, series, reps, peso} = req.body;
    const indice = ejercicios.findIndex(e => e.id === id);

    if (indice !== -1) {
        ejercicios[indice] = {id, nombre, musculo, series, reps, peso};
    res.status(201).json({mensaje: "Ejercicio " + nombre + " actualizado"});
    } else {
        res.status(404).json({mensaje: "No encontrado"});
    }
});

app.delete('/ejercicios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = ejercicios.findIndex(e => e.id === id);

    if (indice !== -1) {
        const borrado = ejercicios.splice(indice, 1);
        res.status(201).json({mensaje: "Ejercicio " + borrado[0].nombre + " eliminado"});
    } else {
        res.status(404).json({mensaje: "No encontrado"});
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});