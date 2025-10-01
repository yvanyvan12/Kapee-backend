import { Request, Response } from "express";
import Product from "../model/productModel";
import { productSchema } from "../validation/productValidation";
import { ZodError } from "zod"; // ✅ Import ZodError for validation handling

// ---------------- SAVE PRODUCT ----------------
async function createProduct(req: Request, res: Response) {
  try {
    const parsedData = productSchema.parse(req.body); // image as string URL
    const newProduct = await Product.create(parsedData);

    return res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue) => issue.message),
      });
    }
    console.error("Error saving product:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

// ---------------- UPDATE PRODUCT ----------------
async function updateProduct(req: Request, res: Response) {
  try {
    const parsedData = productSchema.partial().parse(req.body); // same here

    const updated = await Product.findByIdAndUpdate(req.params.id, parsedData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      data: updated,
      message: "Product updated successfully.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue) => issue.message),
      });
    }
    console.error("Error updating product:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

// ---------------- DELETE PRODUCT ----------------
async function deleteProduct(req: Request, res: Response) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

// ---------------- GET PRODUCT BY ID ----------------
async function getProductById(req: Request, res: Response) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error getting product:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

// ---------------- GET ALL PRODUCTS ----------------
async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error getting products:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

// ✅ Export controller
const productController = { createProduct, deleteProduct, updateProduct, getProductById, getAllProducts };
export default productController;
