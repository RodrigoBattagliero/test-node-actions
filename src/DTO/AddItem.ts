import z from 'zod';

export const AddItemDTOSchema = z.object({
    productId: z.number().int().positive(),
    amount: z.number().int().positive(),
});

export type AddItemDTO = z.infer<typeof AddItemDTOSchema>;
