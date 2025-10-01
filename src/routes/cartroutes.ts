// src/routes/cartroutes.ts
import express from "express";
import { Auth as authenticateToken } from '../middleware/authMiddleware';
import { 
  addToCart, 
  getCart,        
  getCartById,
  updateCartItem, 
  removeFromCart, 
  clearCart       
} from "../controllers/cartControllers";

const cartRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing the shopping cart
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       401:
 *         description: Unauthorized
 */
cartRouter.post("/add", authenticateToken, addToCart);

/**
 * @swagger
 * /cart/get:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Successfully retrieved cart
 *       401:
 *         description: Unauthorized
 */
cartRouter.get("/get", authenticateToken, getCart);

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     summary: Get a cart by its ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart ID
 *     responses:
 *       200:
 *         description: Cart found
 *       404:
 *         description: Cart not found
 */
cartRouter.get("/:id", authenticateToken, getCartById);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Item or cart not found
 */
cartRouter.put("/update", authenticateToken, updateCartItem);

/**
 * @swagger
 * /cart/remove/{productId}:
 *   delete:
 *     summary: Remove a specific item from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found in cart
 */
cartRouter.delete("/remove/:productId", authenticateToken, removeFromCart);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear the entire cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Cart not found
 */
cartRouter.delete("/clear", authenticateToken, clearCart);

export default cartRouter;
