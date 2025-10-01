"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    price: zod_1.z.number().positive("Price must be greater than 0"),
    description: zod_1.z.string().optional(),
    category: zod_1.z.string().min(1, "Category is required"),
    imageUrl: zod_1.z.string().url("Must be a valid URL").optional(),
});
