import { type Response, type Request } from "express";
import Order from "../models/order.model.js";
import MenuItem from "../models/menu.model.js";
export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { customerName, phone, address, items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
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
        return;
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
export const deleteOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Lấy orderId từ params truyền vào URL (ví dụ: /api/orders/:orderId)
    const { orderId } = req.params;

    // 2. Chạy câu lệnh xóa trực tiếp trong MongoDB
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    // 3. Nếu không tìm thấy đơn hàng tương ứng với ID đó
    if (!deletedOrder) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng này trong hệ thống để xóa!",
      });
      return;
    }

    // 4. Xóa thành công, trả về thông tin đơn hàng vừa xóa để Client cập nhật UI
    res.status(200).json({
      success: true,
      message: "Đã xóa đơn hàng thành công!",
      data: deletedOrder,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi thực hiện xóa đơn hàng",
    });
  }
};
export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    // Kiểm tra xem status gửi lên có hợp lệ với enum không
    const validStatuses = ["PENDING", "PREPARING", "DELIVERING", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      res
        .status(400)
        .json({ success: false, message: "Trạng thái đơn hàng không hợp lệ!" });
      return;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true, runValidators: true },
    );

    if (!updatedOrder) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng!" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công!",
      data: updatedOrder,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống khi cập nhật đơn hàng" });
  }
};
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawPage = req.query.page;
    const rawLimit = req.query.limit;
    // 1. Bắt các tham số phân trang từ URL Query (Ví dụ: /api/orders?page=1&limit=5)
    const page = rawPage ? Number(rawPage) : 1;
    const limit = rawLimit ? Number(rawLimit) : 10;
    if (rawPage && (isNaN(page) || !Number.isInteger(page) || page <= 0)) {
      res.status(400).json({
        success: false,
        message: "Tham số số trang (page) phải là một số nguyên dương hợp lệ!",
      });
      return;
    }

    if (rawLimit && (isNaN(limit) || !Number.isInteger(limit) || limit <= 0)) {
      res.status(400).json({
        success: false,
        message: "Tham số giới hạn (limit) phải là một số nguyên dương hợp lệ!",
      });
      return;
    }
    const skip = (page - 1) * limit;

    // 2. Tùy chọn nâng cao: Lọc đơn hàng theo trạng thái nếu Client có yêu cầu (Ví dụ: /api/orders?status=PENDING)
    const filter: any = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // 3. Chạy song song: Đếm tổng số đơn và Lấy dữ liệu kèm Phân trang + Populate
    const [totalItems, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .populate("items.menuItem")
        .sort({ createdAt: -1 }) // Đơn hàng mới nhất xếp lên đầu
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    // 4. Trả về cấu trúc JSON chuẩn chỉnh cho Front-End dễ vẽ giao diện
    res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        limit: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lấy danh sách đơn hàng",
    });
  }
};
