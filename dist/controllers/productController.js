"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productModel_1 = __importDefault(require("../model/productModel"));
const productValidation_1 = require("../validation/productValidation");
const zod_1 = require("zod"); // ✅ Import ZodError for validation handling
// ---------------- SAVE PRODUCT ----------------
async function createProduct(req, res) {
    try {
        const parsedData = productValidation_1.productSchema.parse(req.body); // image as string URL
        const newProduct = await productModel_1.default.create(parsedData);
        return res.status(201).json({
            success: true,
            data: newProduct,
            message: "Product created successfully",
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
async function updateProduct(req, res) {
    try {
        const parsedData = productValidation_1.productSchema.partial().parse(req.body); // same here
        const updated = await productModel_1.default.findByIdAndUpdate(req.params.id, parsedData, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({
            success: true,
            data: updated,
            message: "Product updated successfully.",
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
async function deleteProduct(req, res) {
    try {
        const deleted = await productModel_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, message: "Product deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}
// ---------------- GET PRODUCT BY ID ----------------
async function getProductById(req, res) {
    try {
        const product = await productModel_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        console.error("Error getting product:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}
// ---------------- GET ALL PRODUCTS ----------------
async function getAllProducts(req, res) {
    try {
        const products = await productModel_1.default.find();
        return res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        console.error("Error getting products:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}
// ✅ Export controller
const productController = { createProduct, deleteProduct, updateProduct, getProductById, getAllProducts };
exports.default = productController;
