// src/routes/orderRoutes.ts
import express from "express";
import { placeOrder, getAllOrders, getOrderById, cancelOrder, getUserOrders } from "../controllers/orderController";
import { Auth } from "../middleware/authMiddleware";

const orderRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartId
 *               - address
 *             properties:
 *               cartId:
 *                 type: string
 *                 description: ID of the user's cart
 *               address:
 *                 type: string
 *                 description: Shipping address
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
orderRouter.post("/", Auth, placeOrder);

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get all orders for the current user
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized
 */
orderRouter.get("/", Auth, getUserOrders);

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
orderRouter.get("/:id", Auth, getOrderById);

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Cancel an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
orderRouter.delete("/:id", Auth, cancelOrder);

export default orderRouter;
