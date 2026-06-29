import Order from "../models/order.model.js";
import MenuItem from "../models/menu.model.js";

export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

class OrderService {
  async createOrder(data: any): Promise<any> {
    const { customerName, phone, address, items } = data;

    let caculatedTotalPrice = 0;
    for (const item of items) {
      const menuItemData = await MenuItem.findById(item.menuItem);

      if (!menuItemData) {
        const error: any = new Error(
          `Món ăn với ID ${item.menuItem} không tồn tại!`,
        );
        error.statusCode = 404;
        throw error;
      }

      if (!menuItemData.isAvailable) {
        const error: any = new Error(
          `Món "${menuItemData.name}" hiện đã hết hàng, vui lòng chọn món khác!`,
        );
        error.statusCode = 400;
        throw error;
      }

      caculatedTotalPrice += menuItemData.price * item.quantity;
    }

    const newOrder = new Order({
      customerName,
      phone,
      address,
      items,
      totalPrice: caculatedTotalPrice,
      status: "PENDING",
    });

    const savedOrder = await newOrder.save();
    return savedOrder;
  }

  async deleteOrder(orderId: string): Promise<any> {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    return deletedOrder;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const validStatuses = ["PENDING", "PREPARING", "DELIVERING", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      const error: any = new Error("Trạng thái đơn hàng không hợp lệ!");
      error.statusCode = 400;
      throw error;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true, runValidators: true },
    );

    return updatedOrder;
  }

  async getOrders(
    page: number,
    limit: number,
    status?: string,
  ): Promise<PaginationResult<any>> {
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [totalItems, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .populate("items.menuItem")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: orders,
      totalItems,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}

export default new OrderService();
