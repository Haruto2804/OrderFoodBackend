import Category from "../models/category.model.js";

class CategoryService {
  async getCategories(): Promise<any[]> {
    const items = await Category.find();
    return items;
  }

  async createCategory(data: any): Promise<any> {
    const newCategory = new Category(data);
    const savedItem = await newCategory.save();
    return savedItem;
  }

  async updateCategory(id: string, data: any): Promise<any> {
    const { name, description } = data;
    const result = await Category.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
        },
      },
      { new: true, runValidators: true },
    );
    return result;
  }

  async deleteCategory(id: string): Promise<any> {
    const deletedItem = await Category.findByIdAndDelete(id);
    return deletedItem;
  }
}

export default new CategoryService();
