"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const userPath_1 = __importDefault(require("./routes/userPath"));
const cartroutes_1 = __importDefault(require("./routes/cartroutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
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
        security: [{ bearerAuth: [] }],
    },
    apis: ["./routes/*.ts"], // scans your route files
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs, {
    swaggerOptions: {
        persistAuthorization: true, // keeps token stored
    },
}));
app.use("/users", userPath_1.default);
app.use("/cart", cartroutes_1.default);
app.listen(3000, () => console.log("Server running on port 3000"));
