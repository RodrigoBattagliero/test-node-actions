import { Request, Response, Router } from 'express';
import { cartService } from '../Service/CartService.js';
import { AddItemDTOSchema } from '../DTO/AddItem.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.json((await cartService.getCart()) ?? []);
});

router.get('/detail/:cartId', async (req: Request, res: Response) => {
    const cartId = parseInt(req.params.cartId as string, 10);
    return res.json(await cartService.getDetail(cartId));
});

router.post('/add-item', async (req: Request, res: Response) => {
    const data = AddItemDTOSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: data.error.flatten() });
    }

    const product = await cartService.addItem(data.data);
    return res.json({ product });
});

export { router as cartRouter };
