import { IncomingMessage, ServerResponse } from 'node:http'

export interface Product {
    id: number
    name: string
    price: number
    stock: number
}

let products: Product[] = [
    { id: 1, name: 'Teclado Mecánico', price: 85000, stock: 10 },
    { id: 2, name: 'Mouse Gamer Wireless', price: 45000, stock: 15 }
]

const getRequestBody = (req: IncomingMessage): Promise<string> => {
    return new Promise((resolve, reject) => {
        let body = ''
        req.on('data', (chunk: Buffer) => {
            body += chunk.toString()
        })
        req.on('end', () => resolve(body))
        req.on('error', (err) => reject(err))
    })
}

export const handleProductsRoutes = async (req: IncomingMessage, res: ServerResponse, urlObj: URL) => {
    const { method } = req;

    const idParam = urlObj.searchParams.get('id')
    const id = idParam ? parseInt(idParam, 10) : null

    //res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })

    if (method == 'GET') {
        if (id) {
            const product = products.find(p => p.id === id)
            if (!product) {
                res.writeHead(400)
                return res.end(JSON.stringify({ error: 'Producto no encontrado' }))
            }
            return res.end(JSON.stringify(product));
        }
        return res.end(JSON.stringify(products));
    }

    if (method == 'POST') {
        try {
            const body = await getRequestBody(req)
            const { name, price, stock } = JSON.parse(body)

            if (!name || price == undefined || stock == undefined) {
                res.writeHead(400)
                return res.end(JSON.stringify({ error: 'Campos requeridos: name, price, stock' }));
            }

            const newProduct: Product = {
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                name,
                price,
                stock
            }

            products.push(newProduct)
            res.writeHead(201)
            return res.end(JSON.stringify(newProduct))
        } catch (error) {
            res.writeHead(400)
            return res.end(JSON.stringify({ error: 'JSON inválido en el cuerpo de la petición' }));
        }


    }

    if (method == 'PUT') {
        if (!id) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Se requiere el ID del producto en la URL (?id=X)' }));
        }

        const productIndex = products.findIndex(p => p.id === id)
        if (productIndex === -1) {
            res.writeHead(404);
            return res.end(JSON.stringify({ error: 'Producto no encontrado' }));
        }

        try {
            const body = await getRequestBody(req)
            const data = JSON.parse(body)

            products[productIndex] = {
                ...products[productIndex],
                ...(data.name && { name: data.name }),
                ...(data.price !== undefined && { price: data.price }),
                ...(data.stock !== undefined && { stock: data.stock })
            }

            return res.end(JSON.stringify(products[productIndex]))
        } catch (error) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'JSON inválido' }));
        }
    }

    if (method === 'DELETE') {
        if (!id) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Se requiere el ID del producto en la URL (?id=X)' }));
        }

        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            res.writeHead(404);
            return res.end(JSON.stringify({ error: 'Producto no encontrado' }));
        }

        const [deletedProduct] = products.splice(productIndex, 1)
        return res.end(JSON.stringify({ message: 'Producto eliminado con éxito', product: deletedProduct }));
    }

    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Método no permitido' }));
}