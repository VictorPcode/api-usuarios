const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Rutas
app.use('/api', userRoutes); // Esto hace que todas las rutas de userRoutes empiecen con /api

// Ruta base (opcional)
app.get('/', (req, res) => {
  res.send('Bienvenido a la API REST con Express');
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});