import { z } from "zod";

export const ProductDTOSchema = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().int().min(0),
    description: z.string().optional(),
    imgUrl: z.string().url().optional(),
    categoryId: z.number().int().positive().optional(),
});

export type ProductDTO = z.infer<typeof ProductDTOSchema>;
