import mongoose, { Schema } from "mongoose";
import type { Document } from "postcss";
interface IUser extends Document {
  username: string;
  password: string;
  phone_number: string;
  addresses: string[];
  email: string;
  full_name: string;
  role: "customer" | "admin" | "shipper";
}
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    addresses: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin", "shipper"],
      default: "customer",
    },
  },
  { timestamps: true },
);
export default mongoose.model<IUser>("User", UserSchema);
