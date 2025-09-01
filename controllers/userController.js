const bcrypt = require("bcryptjs"); // Cambia bcrypt por bcryptjs
const jwt = require("jsonwebtoken");

// Clave secreta para firmar el token
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

// ¡En producción usa variables de entorno!
//const mySecret = process.env['SECRET_KEY']

// Simulación de base de datos (solo para ejemplo)
const users = [
  {
    id: 1,
    username: "user1",
    password: "password1",
    role: "user",
  },
  {
    id: 2,
    username: "admin",
    password: "password2",
    role: "admin",
  },
];

// Obtener todos los usuarios (solo para pruebas)
exports.getAllUsers = (req, res) => {
  res.json({ message: "Lista de usuarios", data: users });
};

exports.createUser = (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json({ message: "Usuario creado", data: newUser });
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  // Encriptar la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el nuevo usuario y agregarlo al array simulado
  const newUser = { name, email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: "Usuario registrado exitosamente" });
};

// Login de usuario
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario existe
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "Credenciales incorrectas" });
  }

  // Comparar la contraseña ingresada con la encriptada en la base de datos
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Credenciales incorrectas" });
  }

  // Si las credenciales son correctas, generar el token JWT
  const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ message: "Login exitoso", token });
};
