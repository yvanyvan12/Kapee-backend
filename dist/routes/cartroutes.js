"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/cartroutes.ts
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const cartControllers_1 = require("../controllers/cartControllers");
const cartRouter = express_1.default.Router();
// Protected routes: user must be logged in
cartRouter.post("/add", authMiddleware_1.Auth, cartControllers_1.addToCart);
cartRouter.get("/get", authMiddleware_1.Auth, cartControllers_1.getCart); // Get user's cart
cartRouter.get("/:id", authMiddleware_1.Auth, cartControllers_1.getCartById); // Get cart by specific ID
cartRouter.put("/update", authMiddleware_1.Auth, cartControllers_1.updateCartItem); // Update item quantity
cartRouter.delete("/remove/:productId", authMiddleware_1.Auth, cartControllers_1.removeFromCart); // Remove specific item
cartRouter.delete("/clear", authMiddleware_1.Auth, cartControllers_1.clearCart); // Clear entire cart
exports.default = cartRouter;
