"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const orderRouter = express_1.default.Router();
orderRouter.post("/", authMiddleware_1.Auth, orderController_1.placeOrder);
orderRouter.get("/", authMiddleware_1.Auth, orderController_1.getUserOrders);
orderRouter.get("/:id", authMiddleware_1.Auth, orderController_1.getOrderById);
orderRouter.delete("/:id", authMiddleware_1.Auth, orderController_1.cancelOrder);
exports.default = orderRouter;
