import { isValidObjectId } from "mongoose";
import Category from "../models/category.model.js";
import { type Request, type Response } from "express";
export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const items = await Category.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi Server!!!",
    });
  }
};
export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newCategory = new Category(req.body);
    const savedItem = await newCategory.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({
      message: "Dữ liệu không hợp lệ",
    });
  }
};
export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    const result = await Category.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
        },
      },
      { new: true, runValidators: true },
    );
    if (!result) {
      res
        .status(404)
        .json({ message: "Không tìm thấy loại món ăn này trong hệ thống!" });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi hệ thống khi cập nhật loại món ăn",
    });
  }
};
export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedItem = await Category.findByIdAndDelete(id);
    if (!deletedItem) {
      res
        .status(404)
        .json({ message: "Không tìm thấy loại món ăn này để xóa!" });
      return;
    }
    res.status(200).json({
      message: "Đã xóa loại món ăn thành công!",
      data: deletedItem,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống khi xóa loại món ăn" });
  }
};
