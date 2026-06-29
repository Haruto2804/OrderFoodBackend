import MenuItem from "../models/menu.model.js";
import { Types } from "mongoose";

type MenuQueryFilter = {
  category?: Types.ObjectId;
  $text?: {
    $search: string;
  };
};

export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

class MenuService {
  async getMenuItems(
    page: number,
    limit: number,
    category?: string,
    search?: string,
  ): Promise<PaginationResult<any>> {
    const queryCondition: MenuQueryFilter = {};

    if (category) {
      queryCondition.category = new Types.ObjectId(category as string);
    }

    if (search) {
      const searchStr = search as string;
      queryCondition.$text = {
        $search: searchStr,
      };
    }

    const skip = (page - 1) * limit;
    const [totalItems, items] = await Promise.all([
      MenuItem.countDocuments(queryCondition),
      MenuItem.find(queryCondition)
        .populate("category")
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async createMenuItem(data: any): Promise<any> {
    const newItem = new MenuItem(data);
    const savedItem = await newItem.save();
    return savedItem;
  }

  async updateMenuItem(id: string, data: any): Promise<any> {
    const { name, price, description, isAvailable, category } = data;
    const result = await MenuItem.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
          price,
          isAvailable,
          category,
        },
      },
      { new: true, runValidators: true },
    );
    return result;
  }

  async deleteMenuItem(id: string): Promise<any> {
    const deletedItem = await MenuItem.findByIdAndDelete(id);
    return deletedItem;
  }
}

export default new MenuService();
