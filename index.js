const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const swaggerDocs = require("./swagger");

const app = express();

// Middleware
app.use(bodyParser.json());

// Rutas
app.use("/api", userRoutes);

// Swagger
swaggerDocs(app);

// Ruta base
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Middleware errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error del servidor" });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
});
