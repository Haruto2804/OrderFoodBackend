import { type Request, type Response } from "express";
import mongoose, { isValidObjectId, Types } from "mongoose";
import MenuItem from "../models/menu.model.js";
type MenuQueryFilter = {
  category?: string;
  search?: {
    $regex: string;
    $options: "i";
  };
};
export const getMenuItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { category, search } = req.query;
    const queryCondition: MenuQueryFilter = {};

    if (category) {
      if (!isValidObjectId(category)) {
        res.status(400).json({
          success: false,
          message: "Lỗi category! Category phải là UUID hợp lệ!",
        });
        return;
      }
      // chac chan category chinh la UUID -> string
      const categoryStr = category as string;
      queryCondition.category = categoryStr;
    }
    if (search) {
      const searchStr = search as string;
      queryCondition.search = {
        $regex: searchStr,
        $options: "i",
      };
    }
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
    const skip = (page - 1) * limit;
    const [totalItems, items] = await Promise.all([
      MenuItem.countDocuments(),
      MenuItem.find(queryCondition)
        .populate("category")
        .skip(skip)
        .limit(limit),
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    if (page > totalPages) {
      res.status(404).json({
        success: false,
        message: "Số trang không tồn tại!!!",
      });
      return;
    }
    res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        limit: limit,
        totalPages: totalPages,
        totalItems: totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: items,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi Server!!!",
    });
  }
};

export const createMenuItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newItem = new MenuItem(req.body);
    const savedItem = await newItem.save();
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
    const { name, price, description, isAvailable, category } = req.body;
    const { id } = req.params;
    const result = await MenuItem.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: name,
          description: description,
          price: price,
          isAvailable: isAvailable,
          category: category,
        },
      },
      { new: true, runValidators: true },
    );
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
    const { id } = req.params;
    const deletedItem = await MenuItem.findByIdAndDelete(id);
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
