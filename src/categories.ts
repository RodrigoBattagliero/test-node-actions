import { Router, Request, Response } from "express";
import { prisma } from "../prisma/adapter.js";

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
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Campos requeridos: name' });
    }

    const newCategory = await prisma.category.create({ data: { name } });
    res.status(201).json(newCategory);
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const { name } = req.body;
    const updated = await prisma.category.update({
        where: { id },
        data: { name }
    });

    res.json(updated);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const deleted = await prisma.category.delete({ where: { id } });
    res.json({ message: 'Categoría eliminada con éxito', deleted });
});

export { router as categoriesRouter };
