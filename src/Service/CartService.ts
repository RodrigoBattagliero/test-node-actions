import { prisma } from '../../prisma/adapter.js';
import { AddItemDTO } from '../DTO/AddItem.js';

class CartService {
    async getCart() {
        return await prisma.cart.findFirst();
    }

    async getDetail(cartId: number) {
        return await prisma.cartItem.findMany({
            where: {
                cartId,
            },
            include: { product: true },
        });
    }

    async addItem(item: AddItemDTO) {
        let cart = await this.getCart();

        if (!cart) {
            cart = await prisma.cart.create({ data: {} });
        }
        return await prisma.cartItem.create({
            data: {
                productId: item.productId,
                cartId: cart.id,
                amount: item.amount,
            },
            include: { product: true },
        });
    }
}

export const cartService = new CartService();
