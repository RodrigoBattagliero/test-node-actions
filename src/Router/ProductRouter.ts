import { Router, Request, Response } from "express";
import { prisma } from "../../prisma/adapter.js";
import { ProductDTO } from "../DTO/ProductDTO.js";


const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.json(await prisma.product.findMany({ include: { category: true } }));
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    });

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
});

router.post('', async (req: Request, res: Response) => {
    // Express ya parseó el body a JSON gracias al middleware express.json()
    const { name, price, stock, description, imgUrl, categoryId } = req.body;

    if (!name || price === undefined || stock === undefined) {
        return res.status(400).json({ error: 'Campos requeridos: name, price, stock' });
    }

    const newProduct: ProductDTO = {
        name,
        price,
        stock,
        ...(description !== undefined && { description }),
        ...(imgUrl !== undefined && { imgUrl }),
        ...(categoryId !== undefined && { categoryId })
    };

    const newProductModel = await prisma.product.create({
        data: newProduct,
        include: { category: true }
    });

    res.status(201).json(newProductModel);
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const data: ProductDTO = req.body;
    const updated = await prisma.product.update({
        where: { id },
        data
    });
    res.json(updated);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const deleted = await prisma.product.delete({
        where: {
            id
        }
    })
    res.json({ message: 'Producto eliminado con éxito', deleted });
});

export { router as ProductRouter }