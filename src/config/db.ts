import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const mongoURL = process.env.MONGODB_URL;
  if (!mongoURL) {
    console.error(
      "❌ LỖI: Biến MONGODB_URL chưa được định nghĩa trong file .env!",
    );
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoURL);
    console.log("🍃 Đã kết nối với MongoDB thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối DB:", err);
    process.exit(1);
  }
};
export default connectDB;
