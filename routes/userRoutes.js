const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const SECRET_KEY = "mi_secreto_super_seguro"; // en producción, usa env variable

// Simulación base de datos
let users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("admin123", 10) },
];

// Middleware JWT
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token requerido" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
}

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: CRUD de usuarios
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user1
 *               password:
 *                 type: string
 *                 example: pass123
 *     responses:
 *       201:
 *         description: Usuario registrado
 */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username))
    return res.status(400).json({ message: "Usuario ya existe" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, password: hashed };
  users.push(newUser);
  res.status(201).json({
    message: "Usuario registrado",
    user: { id: newUser.id, username: newUser.username },
  });
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión y recibir token JWT
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Credenciales inválidas" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ message: "Login exitoso", token });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/users", verifyToken, (req, res) => {
  const usersWithoutPassword = users.map((u) => ({
    id: u.id,
    username: u.username,
  }));
  res.json(usersWithoutPassword);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a obtener
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: admin
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/users/:id", verifyToken, (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario por id
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: nuevoUser
 *               password:
 *                 type: string
 *                 example: nuevaPass
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put("/users/:id", verifyToken, async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  if (username) user.username = username;
  if (password) user.password = await bcrypt.hash(password, 10);

  res.json({
    message: "Usuario actualizado",
    user: { id: user.id, username: user.username },
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario por id
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete("/users/:id", verifyToken, (req, res) => {
  const index = users.findIndex((u) => u.id == req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Usuario no encontrado" });
  users.splice(index, 1);
  res.json({ message: "Usuario eliminado" });
});

module.exports = router;
