import { type Response, type Request } from "express";
import Order from "../models/order.model.js";
import MenuItem from "../models/menu.model.js";
export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { customerName, phone, address, items } = req.body;
    if ((!items && !Array.isArray(items)) || items.length === 0) {
      res
        .status(400)
        .json({ success: false, message: "Giỏ hàng không được trống!" });
      return;
    }
    let caculatedTotalPrice = 0;
    for (const item of items) {
      const menuItemData = await MenuItem.findById(item.menuItem);
      // kiem tra mon an co ton tai hay k
      if (!menuItemData) {
        res.status(404).json({
          success: false,
          message: `Món ăn với ID ${item.menuItem} không tồn tại!`,
        });
        return;
      }
      // kiem tra mon an co con bán hay k
      if (!menuItemData.isAvailable) {
        res.status(400).json({
          success: false,
          message: `Món "${menuItemData.name}" hiện đã hết hàng, vui lòng chọn món khác!`,
        });
      }
      caculatedTotalPrice += menuItemData.price * item.quantity;
    }
    const newOrder = new Order({
      customerName: customerName,
      phone: phone,
      address: address,
      items: items,
      totalPrice: caculatedTotalPrice,
      status: "PENDING",
    });
    const savedOrder = await newOrder.save();
    console.log(savedOrder);
    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      data: savedOrder,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Lỗi hệ thống khi tạo đơn hàng: ${err.message}`,
    });
  }
};
