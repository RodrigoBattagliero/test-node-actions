import http, { IncomingMessage, ServerResponse } from 'node:http'
import { handleProductsRoutes } from './products_node.js';

const PORT = 3000

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

    const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
    const { pathname } = parsedUrl;

    if (pathname === '/api/products') {
        handleProductsRoutes(req, res, parsedUrl);
        return;
    }

    if (pathname == '/api/status' && req.method == 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({
            status: 'online',
            environment: 'development',
            timestamp: new Date().toISOString()
        }))

        return;
    }

    if (pathname == '/api/users' && req.method == 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify([
            { id: 1, name: 'Cosme Fulanito', role: 'Dev' },
            { id: 2, name: 'John Doe', role: 'Tester' }
        ]))

        return;
    }

    res.writeHead(404, { 'Content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({
        error: 'Not Found', 
        message: `La ruta ${pathname} con el método ${req.method} no existe.`
    }))
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost.com:${PORT}/`)
})