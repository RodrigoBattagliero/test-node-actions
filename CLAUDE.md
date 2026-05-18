# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (hot reload via tsx watch)
npm run dev

# Build TypeScript to dist/
npm run build

# Run compiled output
npm start
```

No lint or test commands are configured in this project.

### Database (Prisma)

```bash
# Run migrations
npx prisma migrate dev

# Open Prisma Studio (GUI)
npx prisma studio

# Regenerate the Prisma client after schema changes
npx prisma generate
```

## Architecture

This is a learning/testing project that implements the same REST API in two parallel ways — compare them to understand the tradeoff between a framework and raw Node.js.

### Two server implementations

| File | Stack | Data |
|---|---|---|
| [src/index.ts](src/index.ts) | Express v5 | Prisma + SQLite |
| [src/index_node.ts](src/index_node.ts) | Native `http` module | In-memory array |

Both listen on port 3000 and expose `/api/status` and `/api/products`.

### Express implementation (primary)

- [src/index.ts](src/index.ts) — mounts middleware and the products router, registers a 404 fallback.
- [src/products.ts](src/products.ts) — `express.Router` with full CRUD (`GET /api/products`, `GET /api/products/:id`, `POST`, `PUT`, `DELETE`).
- [prisma/adapter.ts](prisma/adapter.ts) — creates and exports the singleton `PrismaClient` instance backed by `better-sqlite3`.

### Database

- SQLite file at `./dev.db` (path set via `DATABASE_URL` in `.env`).
- Schema: single `Product` model (`id`, `name`, `price`, `stock`) defined in [prisma/schema.prisma](prisma/schema.prisma).
- Generated client lives in [generated/prisma/](generated/prisma/) (excluded from git).

### Module system

The project uses ES Modules (`"type": "module"` in package.json) with `moduleResolution: nodenext` in TypeScript, so all local imports require explicit `.js` extensions even in `.ts` source files.
