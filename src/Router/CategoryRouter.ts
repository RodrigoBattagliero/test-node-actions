import { Router, Request, Response } from "express";
import { prisma } from "../../prisma/adapter.js";
import { CategoryDTOSchema } from "../DTO/CategoryDTO.js";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.json(await prisma.category.findMany({ include: { products: true } }));
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const category = await prisma.category.findUnique({
        where: { id },
        include: { products: true }
    });

    if (!category) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(category);
});

router.post('/', async (req: Request, res: Response) => {
    const result = CategoryDTOSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
    }

    const created = await prisma.category.create({ data: result.data });
    res.status(201).json(created);
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const result = CategoryDTOSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
    }

    const updated = await prisma.category.update({
        where: { id },
        data: result.data
    });

    res.json(updated);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const deleted = await prisma.category.delete({ where: { id } });
    res.json({ message: 'Categoría eliminada con éxito', deleted });
});

export { router as CategoryRouter };
