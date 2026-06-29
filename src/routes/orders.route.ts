import express from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";
const router = express.Router();
//ORDER ROUTES
router.get("/", getOrders);
router.post("/", createOrder);
router.delete("/:orderId", deleteOrder);
router.patch("/status/:orderId", updateOrderStatus);
export default router;
