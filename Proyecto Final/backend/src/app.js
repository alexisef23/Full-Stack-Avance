const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const usuariosRoutes = require('./routes/usuarios.routes');
const ejerciciosRoutes = require('./routes/ejercicios.routes');
const historialRoutes = require('./routes/historial.routes');
const chatRoutes = require('./routes/chat.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/ejercicios', ejerciciosRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorMiddleware);

module.exports = app;

