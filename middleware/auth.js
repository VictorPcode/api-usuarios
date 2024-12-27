const jwt = require('jsonwebtoken');
const SECRET_KEY = 'mi_secreto_super_seguro';

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
    req.user = decoded; // Guardamos la información del usuario en la request
    next(); // Pasamos al siguiente middleware o ruta
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = verifyToken;