import { Router, Request, Response } from 'express';
import { ProductDTOSchema } from '../DTO/ProductDTO.js';
import { productService } from '../Service/ProductService.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.json(await productService.getProducts());
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const product = await productService.getProductById(id);

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
});

router.post('', async (req: Request, res: Response) => {
    const result = ProductDTOSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
    }

    const newProductModel = await productService.createProduct(result.data);
    res.status(201).json(newProductModel);
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const result = ProductDTOSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
    }

    const updated = await productService.updateProduct(id, result.data);
    res.json(updated);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const deleted = await productService.deleteProduct(id);
    res.json({ message: 'Producto eliminado con éxito', deleted });
});

export { router as ProductRouter };
