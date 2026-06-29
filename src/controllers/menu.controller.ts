import { type Request, type Response } from "express";
import { isValidObjectId } from "mongoose";
import menuService from "../services/menu.service.js";

export const getMenuItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { category, search } = req.query;

    // kiem tra page co phai la so hop le
    if (isNaN(page) || page <= 0) {
      res.status(400).json({
        success: false,
        message: "Số trang (page) phải là số nguyên dương!",
      });
      return;
    }
    // kiem tra limit co phai la so hop le
    if (isNaN(limit) || limit <= 0) {
      res.status(400).json({
        success: false,
        message: "Giới hạn (limit) phải là số nguyên dương!",
      });
      return;
    }
    const categoryStr = category ? (category as string) : undefined;
    const searchStr = search ? (search as string) : undefined;

    if (categoryStr) {
      if (!isValidObjectId(categoryStr)) {
        res.status(400).json({
          success: false,
          message: "Lỗi category! Category phải là Object_ID hợp lệ!",
        });
        return;
      }
    }

    const result = await menuService.getMenuItems(
      page,
      limit,
      categoryStr,
      searchStr,
    );

    res.status(200).json({
      success: true,
      pagination: {
        currentPage: result.currentPage,
        limit: result.limit,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
      data: result.items,
    });
  } catch (err: any) {
    res.status(500).json({
      message: `Lỗi khi tìm kiếm món ăn: ${err.message}`,
    });
  }
};

export const createMenuItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const savedItem = await menuService.createMenuItem(req.body);
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({
      message: "Dữ liệu không hợp lệ",
    });
  }
};

export const updateMenuItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await menuService.updateMenuItem(id, req.body);

    if (!result) {
      res
        .status(404)
        .json({ message: "Không tìm thấy món ăn này trong hệ thống!" });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi hệ thống khi cập nhật món ăn",
    });
  }
};

export const deleteMenuItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const deletedItem = await menuService.deleteMenuItem(id);

    if (!deletedItem) {
      res.status(404).json({ message: "Không tìm thấy món ăn này để xóa!" });
      return;
    }
    res.status(200).json({
      message: "Đã xóa món ăn thành công!",
      data: deletedItem,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống khi xóa món ăn" });
  }
};
