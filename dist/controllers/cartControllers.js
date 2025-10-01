"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCart = exports.updateCart = exports.getCartById = exports.getAllCarts = exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const CartModels_1 = __importDefault(require("../model/CartModels"));
// Add item to cart
const addToCart = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "Unauthorized: userId not found in request",
            });
        }
        const { productId, quantity = 1 } = req.body;
        // Validate required fields
        if (!productId) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Product ID is required",
            });
        }
        let cart = await CartModels_1.default.findOne({ userId: req.userId });
        if (!cart) {
            // Create new cart for this user
            cart = new CartModels_1.default({
                userId: req.userId,
                items: [{ productId, quantity }],
            });
        }
        else {
            // Check if product already in cart
            const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
            if (existingItemIndex > -1) {
                // Update existing item quantity
                cart.items[existingItemIndex].quantity += quantity;
            }
            else {
                // Add new item to cart
                cart.items.push({ productId, quantity });
            }
        }
        await cart.save();
        // Populate cart with product details before sending response
        await cart.populate({
            path: 'items.productId',
            select: 'name price description imageUrl category'
        });
        res.status(201).json({
            success: true,
            data: cart,
            message: "Item added to cart successfully",
        });
    }
    catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: error.message || "Failed to add item to cart",
        });
    }
};
exports.addToCart = addToCart;
// Get user's cart (matching your frontend call to /cart/get)
const getCart = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "Unauthorized: userId not found in request",
            });
        }
        const cart = await CartModels_1.default.findOne({ userId: req.userId }).populate({
            path: 'items.productId',
            select: 'name price description imageUrl category'
        });
        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                    userId: req.userId,
                    items: [],
                    totalItems: 0,
                    totalPrice: 0
                },
                message: "Cart is empty",
            });
        }
        // Calculate totals
        const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.items.reduce((total, item) => {
            const price = item.productId?.price || 0;
            return total + (price * item.quantity);
        }, 0);
        res.status(200).json({
            success: true,
            data: {
                ...cart.toObject(),
                totalItems,
                totalPrice: parseFloat(totalPrice.toFixed(2))
            },
            message: "Cart retrieved successfully",
        });
    }
    catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: error.message || "Failed to retrieve cart",
        });
    }
};
exports.getCart = getCart;
// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "Unauthorized: userId not found in request",
            });
        }
        const { productId, quantity } = req.body;
        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Product ID and quantity are required",
            });
        }
        const cart = await CartModels_1.default.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Cart not found",
            });
        }
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Item not found in cart",
            });
        }
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
        }
        else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }
        await cart.save();
        // Populate and return updated cart
        await cart.populate({
            path: 'items.productId',
            select: 'name price description imageUrl category'
        });
        res.status(200).json({
            success: true,
            data: cart,
            message: "Cart updated successfully",
        });
    }
    catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: error.message || "Failed to update cart",
        });
    }
};
exports.updateCartItem = updateCartItem;
// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "Unauthorized: userId not found in request",
            });
        }
        const { productId } = req.params;
        const cart = await CartModels_1.default.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Cart not found",
            });
        }
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Item not found in cart",
            });
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
        // Populate and return updated cart
        await cart.populate({
            path: 'items.productId',
            select: 'name price description imageUrl category'
        });
        res.status(200).json({
            success: true,
            data: cart,
            message: "Item removed from cart successfully",
        });
    }
    catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: error.message || "Failed to remove item from cart",
        });
    }
};
exports.removeFromCart = removeFromCart;
// Clear entire cart
const clearCart = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "Unauthorized: userId not found in request",
            });
        }
        const cart = await CartModels_1.default.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Cart not found",
            });
        }
        cart.items = [];
        await cart.save();
        res.status(200).json({
            success: true,
            data: cart,
            message: "Cart cleared successfully",
        });
    }
    catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: error.message || "Failed to clear cart",
        });
    }
};
exports.clearCart = clearCart;
// Legacy methods for backward compatibility
const getAllCarts = async (req, res) => {
    // Redirect to getCart for consistency
    return (0, exports.getCart)(req, res);
};
exports.getAllCarts = getAllCarts;
const getCartById = async (req, res) => {
    try {
        const cart = await CartModels_1.default.findById(req.params.id).populate({
            path: 'items.productId',
            select: 'name price description imageUrl category'
        });
        if (!cart) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Cart not found"
            });
        }
        res.json({ success: true, data: cart });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Error fetching cart"
        });
    }
};
exports.getCartById = getCartById;
const updateCart = async (req, res) => {
    // Redirect to updateCartItem for consistency
    return (0, exports.updateCartItem)(req, res);
};
exports.updateCart = updateCart;
const deleteCart = async (req, res) => {
    // Redirect to clearCart for consistency
    return (0, exports.clearCart)(req, res);
};
exports.deleteCart = deleteCart;
