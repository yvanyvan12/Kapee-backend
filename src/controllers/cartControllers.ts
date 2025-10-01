// src/controllers/cartControllers.ts
import { Request, Response } from "express";
import Cart from "../model/CartModels";
import { cartSchema } from "../validation/cartValidation";
import { ZodError } from "zod";

// Add item to cart
export const addToCart = async (req: any, res: Response) => {
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

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      // Create new cart for this user
      cart = new Cart({
        userId: req.userId,
        items: [{ productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        (item: any) => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
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
  } catch (error: any) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Failed to add item to cart",
    });
  }
};

// Get user's cart (matching your frontend call to /cart/get)
export const getCart = async (req: any, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Unauthorized: userId not found in request",
      });
    }

    const cart = await Cart.findOne({ userId: req.userId }).populate({
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
    const totalItems = cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
    const totalPrice = cart.items.reduce((total: number, item: any) => {
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
  } catch (error: any) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Failed to retrieve cart",
    });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req: any, res: Response) => {
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

    const cart = await Cart.findOne({ userId: req.userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

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
    } else {
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
  } catch (error: any) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Failed to update cart",
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req: any, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Unauthorized: userId not found in request",
      });
    }

    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

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
  } catch (error: any) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Failed to remove item from cart",
    });
  }
};

// Clear entire cart
export const clearCart = async (req: any, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Unauthorized: userId not found in request",
      });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    
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
  } catch (error: any) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Failed to clear cart",
    });
  }
};

// Legacy methods for backward compatibility
export const getAllCarts = async (req: any, res: Response) => {
  // Redirect to getCart for consistency
  return getCart(req, res);
};

export const getCartById = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findById(req.params.id).populate({
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
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: "Error fetching cart" 
    });
  }
};

export const updateCart = async (req: any, res: Response) => {
  // Redirect to updateCartItem for consistency
  return updateCartItem(req, res);
};

export const deleteCart = async (req: any, res: Response) => {
  // Redirect to clearCart for consistency
  return clearCart(req, res);
};