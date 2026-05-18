import { prisma } from "../../prisma/adapter.js";
import { ProductDTO } from "../DTO/ProductDTO.js";

class ProductService {
    async getProducts() {
        return prisma.product.findMany({ include: { category: true } });
    }

    async getProductById(id: number) {
        return prisma.product.findUnique({ where: { id }, include: { category: true } });
    }

    async createProduct(product: ProductDTO) {
        return prisma.product.create({ data: product, include: { category: true } });
    }

    async updateProduct(id: number, data: ProductDTO) {
        return prisma.product.update({ where: { id }, data, include: { category: true } });
    }

    async deleteProduct(id: number) {
        return prisma.product.delete({ where: { id } });
    }
}

export const productService = new ProductService();
