import { prisma } from "../../prisma/adapter.js";
import { CategoryDTO } from "../DTO/CategoryDTO.js";

class CategoryService {
    async getCategories() {
        return prisma.category.findMany({ include: { products: true } });
    }

    async getCategoryById(id: number) {
        return prisma.category.findUnique({ where: { id }, include: { products: true } });
    }

    async createCategory(data: CategoryDTO) {
        return prisma.category.create({ data });
    }

    async updateCategory(id: number, data: CategoryDTO) {
        return prisma.category.update({ where: { id }, data });
    }

    async deleteCategory(id: number) {
        return prisma.category.delete({ where: { id } });
    }
}

export const categoryService = new CategoryService();
