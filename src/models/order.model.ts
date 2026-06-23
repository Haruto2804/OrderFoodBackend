import mongoose, { Schema, Types, type Document } from "mongoose";

interface IOrderItem {
  menuItem: Types.ObjectId;
  quantity: number;
}
export interface IOrder extends Document {
  customerName: string;
  phone: string;
  address: string;
  items: IOrderItem[];
  totalPrice: number;
  status: "PENDING" | "PREPARING" | "DELIVERING" | "COMPLETED";
}

const OrderSchema: Schema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    items: [
      {
        menuItem: {
          type: Types.ObjectId,
          required: true,
          ref: "MenuItem",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "PREPARING", "DELIVERING", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);
export default mongoose.model<IOrder>("order", OrderSchema);
