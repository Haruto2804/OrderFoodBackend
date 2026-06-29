import express, { type Request, type Response } from "express";
import * as dotenv from "dotenv"; // 1. Import dotenv
import mongoose from "mongoose";
import menuRoute from "./routes/menu.route.js";
import categoriesRoute from "./routes/categories.route.js";
import ordersRoute from "./routes/orders.route.js";
import connectDB from "./config/db.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
dotenv.config();
//MENU ROUTE
app.use("/api/menu", menuRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/orders", ordersRoute);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  });
});
