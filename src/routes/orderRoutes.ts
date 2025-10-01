import express from "express";
import { placeOrder, getAllOrders, getOrderById, cancelOrder, getUserOrders } from "../controllers/orderController";
import { Auth } from "../middleware/authMiddleware";

const orderRouter = express.Router();

orderRouter.post("/", Auth, placeOrder);
orderRouter.get("/", Auth, getUserOrders);
orderRouter.get("/:id", Auth, getOrderById);
orderRouter.delete("/:id", Auth, cancelOrder);

export default orderRouter;