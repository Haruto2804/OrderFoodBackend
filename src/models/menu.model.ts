import mongoose, { Schema, Document } from "mongoose";
export interface IMenuItem extends Document {
  name: string;
  price: number;
  description: string;
  isAvailable: boolean;
  category: mongoose.Types.ObjectId;
}
const MenuItemSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
});
MenuItemSchema.index({ name: "text" });
export default mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
