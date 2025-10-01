// src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // version
    info: {
      title: "My API Documentation", // your API name
      version: "1.0.0",
      description: "This is the API documentation for my project",
    },
    servers: [
      {
        url: "http://localhost:3000", // your backend base URL
      },
    ],
  },
  // Path to your route files where Swagger will read JSDoc comments
  apis: ["./src/routes/*.ts"], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
