import mongoose, { Schema, Document } from "mongoose";
interface ICategory extends Document {
  name: string;
  description: string;
}
const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Hiện món ăn không có mô tả.",
  },
});
export default mongoose.model<ICategory>("Category", CategorySchema);
