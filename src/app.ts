import express, { type Request, type Response } from "express";
import * as dotenv from "dotenv"; // 1. Import dotenv
dotenv.config();
import mongoose from "mongoose";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "./controllers/menu.controller.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  findById,
} from "./controllers/category.controller.js";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "./controllers/order.controller.js";
const app = express();
const PORT = process.env.PORT || 3000; // Ưu tiên lấy PORT của hệ thống cấp
app.use(express.json());

// MENU ROUTES
app.get("/api/menu", getMenuItems);
app.post("/api/menu", createMenuItem);
app.put("/api/menu/:id", updateMenuItem);
app.delete("/api/menu/:id", deleteMenuItem);

//CATEGORY ROUTES
app.get("/api/categories", getCategories);
app.get("/api/categories", getCategories);
app.post("/api/categories", createCategory);
app.put("/api/categories/:id", updateCategory);
app.delete("/api/categories/:id", deleteCategory);

//ORDER ROUTES
app.get("/api/order", getOrders);
app.post("/api/order", createOrder);
app.delete("/api/order/:orderId", deleteOrder);
app.patch("/api/order/status/:orderId", updateOrderStatus);
const mongoURL = process.env.MONGODB_URL;
if (!mongoURL) {
  throw new Error(
    "LỖI: Biến MONGODB_URI chưa được định nghĩa trong file .env!",
  );
}
await mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Đã kết nối với MongoDB");
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Lỗi kết nối DB:", err);
  });
