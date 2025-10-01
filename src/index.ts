import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

// Routers
import productRouter from './routes/productRoutes';
import cartRouter from './routes/cartroutes';
import orderRouter from './routes/orderRoutes';
import mainRouter from './routes/userPath';
import contactRouter from './routes/contactRoutes';

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

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

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// 🔹 Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// MongoDB connection
mongoose
  .connect(
    'mongodb+srv://yvanyvan0788_db_user:6eD4IrY6K8qgGmEi@cluster0.0bs7vij.mongodb.net/'
  )
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
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/user', mainRouter);
app.use('/api', contactRouter);
