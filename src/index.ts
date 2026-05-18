import express, { Request, Response } from 'express';
import { ProductRouter } from './Router/ProductRouter.js';
import { categoriesRouter } from './categories.js';
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/status', (req: Request, res: Response) => {
    res.json({ 
        status: 'online', 
        framework: 'express',
        timestamp: new Date().toISOString() 
    });
});

app.use('/api/products', ProductRouter);
app.use('/api/categories', categoriesRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({ 
        error: 'Not Found', 
        message: `La ruta ${req.originalUrl} no existe.` 
    });
});

app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}/`);
});