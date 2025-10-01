"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// Routers
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartroutes_1 = __importDefault(require("./routes/cartroutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const userPath_1 = __importDefault(require("./routes/userPath"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
// Swagger
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const port = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// 🔹 Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API Docs',
            version: '1.0.0',
            description: 'API documentation for the E-commerce project',
        },
        servers: [
            {
                url: `http://localhost:${port}`, // adjust if deployed
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path where your route files live
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// 🔹 Swagger UI route
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// MongoDB connection
mongoose_1.default
    .connect('mongodb+srv://yvanyvan0788_db_user:6eD4IrY6K8qgGmEi@cluster0.0bs7vij.mongodb.net/')
    .then(() => {
    console.log('well connected');
    app.listen(port, () => {
        console.log(`your server is up and running on port : ${port}`);
        console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
    });
})
    .catch((err) => {
    console.log('failed to connect ', err.message);
});
// Existing routes
app.use('/products', productRoutes_1.default);
app.use('/cart', cartroutes_1.default);
app.use('/order', orderRoutes_1.default);
app.use('/user', userPath_1.default);
app.use('/api', contactRoutes_1.default);
