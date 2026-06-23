import express, { type Request, type Response } from "express";
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
const app = express();
const PORT = 3000;
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

mongoose
  .connect("mongodb://localhost:27017/Food_Server")
  .then(() => {
    console.log("Đã kết nối với MongoDB");
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Lỗi kết nối DB:", err);
  });
