const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Usuarios",
      version: "1.0.0",
      description: "CRUD con register/login",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // busca los comentarios JSDoc
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use(
    "/api-docs",
    require("swagger-ui-express").serve,
    require("swagger-ui-express").setup(swaggerSpec),
  );
}

module.exports = swaggerDocs;
