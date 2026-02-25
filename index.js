const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ejerciciosRoutes = require('./src/routes/ejercicios.routes');
const usersRoutes = require('./src/routes/users.routes');
const rutinasRoutes = require('./src/routes/rutinas.routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/ejercicios', ejerciciosRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/rutinas', rutinasRoutes);

app.get('/', (req, res) => {
    res.send('API Fitness Tracker con IA Funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});