const express = require('express');
const { getAllUsers, createUser, loginUser, registerUser } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// Ruta para obtener todos los usuarios (protegida)
router.get('/users', verifyToken, getAllUsers);

// Ruta para crear un nuevo usuario (Solo para pruebas)
router.post('/users', createUser);

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para login (Generar JWT)
router.post('/login', loginUser);

module.exports = router;