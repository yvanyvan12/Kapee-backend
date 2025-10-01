import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../model/orderModels";
import Cart from "../model/CartModels";
import Product from "../model/productModel"; // make sure path and name are correct
import { orderSchema } from "../validation/orderValidation";
import { ZodError } from "zod";

// --------------------------
// Place an order
// --------------------------
export const placeOrder = async (req: any, res: Response) => {
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
    const { items } = orderSchema.parse(req.body);
    
    // Fetch cart items for the specific user (not all carts!)
    const userCart = await Cart.findOne({ userId: req.userId });
    
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Cart is empty",
      });
    }

    let total = 0;
    const orderItems: { productId: mongoose.Types.ObjectId; quantity: number }[] = []; // Fixed type

    // Validate each product in the cart
    for (const item of userCart.items) { 
      const productExists = await Product.findById(item.productId);
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
        productId: item.productId as mongoose.Types.ObjectId, // Ensure it's ObjectId
        quantity: item.quantity,
      });
    }

    // Create new order
    const order = new Order({
      userId: req.userId, // Add userId to order
      items: orderItems,
      total,
    });

    await order.save();

    // Clear only this user's cart (not all carts!)
    await Cart.findOneAndDelete({ userId: req.userId });

    res.status(201).json({
      success: true,
      data: order,
      message: "Order placed successfully",
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
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

// --------------------------
// Get all orders
// --------------------------
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    // Make sure Product model is imported before populate
    const orders = await Order.find().populate({
      path: "items.productId",
      model: "Product",
      strictPopulate: false, // prevents errors if productId doesn't exist
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to fetch orders",
    });
  }
};

// --------------------------
// Get orders for logged-in user
// --------------------------
export const getUserOrders = async (req: any, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Authentication required",
      });
    }

    const orders = await Order.find({ userId: req.userId }).populate({
      path: "items.productId",
      model: "Product",
      strictPopulate: false,
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to fetch orders",
    });
  }
};

// --------------------------
// Get order by ID
// --------------------------
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate({
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
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Error fetching order",
    });
  }
};

// --------------------------
// Cancel order
// --------------------------
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
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
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to cancel order",
    });
  }
};