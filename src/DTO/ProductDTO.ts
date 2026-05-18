export interface ProductDTO {
    name: string;
    price: number;
    stock: number;
    description?: string;
    imgUrl?: string;
    categoryId?: number;
}