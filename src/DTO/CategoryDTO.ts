import { z } from "zod";

export const CategoryDTOSchema = z.object({
    name: z.string().min(1),
});

export type CategoryDTO = z.infer<typeof CategoryDTOSchema>;
