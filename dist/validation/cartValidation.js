"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = void 0;
const zod_1 = require("zod");
exports.cartSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required"),
    products: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().min(1, "Product ID is required"),
        quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
    }))
        .nonempty("At least one product is required"),
});
