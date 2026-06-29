import express from "express";
import {
  getMenuItems,
  createMenuItem,
  deleteMenuItem,
  updateMenuItem,
} from "../controllers/menu.controller.js";
const router = express.Router();
// MENU ROUTES
router.get("/", getMenuItems);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);
export default router;
