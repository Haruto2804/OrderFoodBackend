import { type Request, type Response } from "express";
import categoryService from "../services/category.service.js";

export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const items = await categoryService.getCategories();
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
    const savedItem = await categoryService.createCategory(req.body);
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
    const id = req.params.id as string;
    const result = await categoryService.updateCategory(id, req.body);

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
    const id = req.params.id as string;
    const deletedItem = await categoryService.deleteCategory(id);

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
