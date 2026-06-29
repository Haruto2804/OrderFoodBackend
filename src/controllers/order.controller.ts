import { type Response, type Request } from "express";
import orderService from "../services/orders.service.js";

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

    const savedOrder = await orderService.createOrder(req.body);

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      data: savedOrder,
    });
  } catch (err: any) {
    if (err.statusCode) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
      return;
    }
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
    const orderId = req.params.orderId as string;
    const deletedOrder = await orderService.deleteOrder(orderId);

    if (!deletedOrder) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng này trong hệ thống để xóa!",
      });
      return;
    }

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
    const orderId = req.params.orderId as string;
    const { status } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công!",
      data: updatedOrder,
    });
  } catch (err: any) {
    if (err.statusCode) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi cập nhật đơn hàng",
    });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Lấy dữ liệu dưới dạng chuỗi
    const rawPage = req.query.page as string | undefined;
    const rawLimit = req.query.limit as string | undefined;
    const status = req.query.status as string | undefined;

    // 2. Chuyển đổi và thiết lập giá trị mặc định
    const page = rawPage ? Number(rawPage) : 1;
    const limit = rawLimit ? Number(rawLimit) : 10;

    // 3. Validate số trang (Page)
    if (rawPage && (isNaN(page) || !Number.isInteger(page) || page <= 0)) {
      res.status(400).json({
        success: false,
        message: "Tham số số trang (page) phải là một số nguyên dương hợp lệ!",
      });
      return;
    }

    // 4. Validate giới hạn hiển thị (Limit)
    if (rawLimit && (isNaN(limit) || !Number.isInteger(limit) || limit <= 0)) {
      res.status(400).json({
        success: false,
        message: "Tham số giới hạn (limit) phải là một số nguyên dương hợp lệ!",
      });
      return;
    }

    // 5. Gọi Service xử lý logic (Nhớ xử lý trường hợp status bị undefined trong service)
    const result = await orderService.getOrders(page, limit, status);

    // 6. Trả về kết quả thành công cho client
    res.status(200).json({
      success: true,
      pagination: {
        currentPage: result.currentPage,
        limit: result.limit,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
      data: result.items,
    });
  } catch (err) {
    // Nên log lỗi ra console để dev dễ debug khi code chạy ở môi trường local
    console.error("Error at getOrders Controller:", err);

    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lấy danh sách đơn hàng",
    });
  }
};
