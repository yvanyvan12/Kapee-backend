"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const zod_1 = require("zod");
exports.orderSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string(), // just check it's provided
        quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
    }))
});
