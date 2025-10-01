// src/routes/cartroutes.ts
import express from "express";
import { Auth as authenticateToken } from '../middleware/authMiddleware';
import { 
  addToCart, 
  getCart,        // Updated to match the new controller method
  getCartById,
  updateCartItem, // Updated method name
  removeFromCart, // Updated method name
  clearCart       // Updated method name
} from "../controllers/cartControllers";

const cartRouter = express.Router();

// Protected routes: user must be logged in
cartRouter.post("/add", authenticateToken, addToCart);
cartRouter.get("/get", authenticateToken, getCart);                    // Get user's cart
cartRouter.get("/:id", authenticateToken, getCartById);               // Get cart by specific ID
cartRouter.put("/update", authenticateToken, updateCartItem);         // Update item quantity
cartRouter.delete("/remove/:productId", authenticateToken, removeFromCart); // Remove specific item
cartRouter.delete("/clear", authenticateToken, clearCart);            // Clear entire cart

export default cartRouter;