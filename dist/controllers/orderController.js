"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.getOrderById = exports.getUserOrders = exports.getAllOrders = exports.placeOrder = void 0;
const orderModels_1 = __importDefault(require("../model/orderModels"));
const CartModels_1 = __importDefault(require("../model/CartModels"));
const productModel_1 = __importDefault(require("../model/productModel")); // make sure path and name are correct
const orderValidation_1 = require("../validation/orderValidation");
const zod_1 = require("zod");
// --------------------------
// Place an order
// --------------------------
const placeOrder = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "Authentication required to place order",
            });
        }
        // Validate input (only items + quantity)
        const { items } = orderValidation_1.orderSchema.parse(req.body);
        // Fetch cart items for the specific user (not all carts!)
        const userCart = await CartModels_1.default.findOne({ userId: req.userId });
        if (!userCart || userCart.items.length === 0) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Cart is empty",
            });
        }
        let total = 0;
        const orderItems = []; // Fixed type
        // Validate each product in the cart
        for (const item of userCart.items) {
            const productExists = await productModel_1.default.findById(item.productId);
            if (!productExists) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: `Product with ID ${item.productId} not found`,
                });
            }
            const itemTotal = productExists.price * item.quantity;
            total += itemTotal;
            orderItems.push({
                productId: item.productId, // Ensure it's ObjectId
                quantity: item.quantity,
            });
        }
        // Create new order
        const order = new orderModels_1.default({
            userId: req.userId, // Add userId to order
            items: orderItems,
            total,
        });
        await order.save();
        // Clear only this user's cart (not all carts!)
        await CartModels_1.default.findOneAndDelete({ userId: req.userId });
        res.status(201).json({
            success: true,
            data: order,
            message: "Order placed successfully",
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                success: false,
                data: null,
                message: error.issues.map((e) => e.message).join(", "),
            });
        }
        console.error("Error placing order:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: "Failed to place order",
        });
    }
};
exports.placeOrder = placeOrder;
// --------------------------
// Get all orders
// --------------------------
const getAllOrders = async (_req, res) => {
    try {
        // Make sure Product model is imported before populate
        const orders = await orderModels_1.default.find().populate({
            path: "items.productId",
            model: "Product",
            strictPopulate: false, // prevents errors if productId doesn't exist
        });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: "Failed to fetch orders",
        });
    }
};
exports.getAllOrders = getAllOrders;
// --------------------------
// Get orders for logged-in user
// --------------------------
const getUserOrders = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "Authentication required",
            });
        }
        const orders = await orderModels_1.default.find({ userId: req.userId }).populate({
            path: "items.productId",
            model: "Product",
            strictPopulate: false,
        });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: "Failed to fetch orders",
        });
    }
};
exports.getUserOrders = getUserOrders;
// --------------------------
// Get order by ID
// --------------------------
const getOrderById = async (req, res) => {
    try {
        const order = await orderModels_1.default.findById(req.params.id).populate({
            path: "items.productId",
            model: "Product",
            strictPopulate: false,
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Order not found",
            });
        }
        res.json({ success: true, data: order });
    }
    catch (error) {
        console.error("Error fetching order by ID:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: "Error fetching order",
        });
    }
};
exports.getOrderById = getOrderById;
// --------------------------
// Cancel order
// --------------------------
const cancelOrder = async (req, res) => {
    try {
        const order = await orderModels_1.default.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Order not found",
            });
        }
        res.json({
            success: true,
            data: order,
            message: "Order cancelled successfully",
        });
    }
    catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({
            success: false,
            data: null,
            message: "Failed to cancel order",
        });
    }
};
exports.cancelOrder = cancelOrder;
