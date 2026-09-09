# Fastify + AJV — Validator Tercepat untuk Node.js

> Contoh **validator kilat** dengan **Fastify + AJV + ajv-errors**. Validasi `body/params` di-compile jadi function, bukan interpret — 10-20x lebih cepat dari `Joi/Zod` di hot path.

Punya API Node.js tapi validasi masih manual `if (!email) ...`? Repo ini menunjukkan cara **clean, type-safe, tanpa `any`** untuk validasi request di Fastify.

## Kenapa AJV?

* **Super cepat** — schema di-compile sekali, dipakai ribuan req/detik (dipakai Fastify internal)
* **Type-safe** — `json-schema-to-ts` infer `FromSchema` langsung jadi `TypeScript type`
* **Pesan error enak** — `ajv-errors` + `errorMessage` per-field (ID/EN)
* **Auto-sanitize** — `removeAdditional: 'all'` buang field ngaco otomatis

## Quick Start

```bash
pnpm install
pnpm dev        # tsx watch src/main.ts → http://localhost:3000
pnpm build && pnpm start  # prod: tsc → node dist/main.js
```

## Contoh Validator

### POST /todos — `body` + `email` format

```ts
// src/schemas/todo.schema.ts
export const createTodoBodySchema = {
  type: 'object',
  required: ['title','price','email'],
  properties: {
    title: { type: 'string', minLength: 3, maxLength: 100 },
    price: { type: 'number', minimum: 0 },
    email: { type: 'string', format: 'email' },
    description: { type: 'string' }
  },
  errorMessage: {
    required: { title: 'Properti title wajib diisi!' },
    properties: {
      email: 'Format email tidak valid'
    }
  }
} as const
```

```ts
// src/routes/todo.routes.ts
fastify.post<{ Body: FromSchema<typeof createTodoBodySchema> }>(
  '/todos',
  { schema: { body: createTodoBodySchema } },
  async (req, reply) => {
    // req.body sudah typed & bersih dari field tambahan
    return reply.status(201).send({ data: req.body })
  }
)
```

**Coba:**

```bash
# valid
curl -X POST localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Beli susu","price":15000,"email":"firman@example.com"}'

# invalid → 400 string[] langsung
curl -X POST localhost:3000/todos -H "Content-Type: application/json" -d '{}'
# {
#   "statusCode": 400,
#   "message": "Validasi input gagal",
#   "errors": ["Properti title wajib diisi!","Properti price wajib diisi!","Properti email wajib diisi!"]
# }
```

### GET /todos/:id — `params` UUID

```ts
export const todoParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid', errorMessage: { format: 'Format ID harus berupa UUID yang valid' } }
  }
} as const
```

### Error Response — `string[]` clean

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validasi input gagal",
  "errors": ["Title minimal berisi 3 karakter", "Price tidak boleh negatif", "Format email tidak valid"]
}
```

## Struktur Rapih

```
src/
  app.ts              # Fastify + AJV (allErrors, removeAdditional, ajv-errors)
  schemas/todo.schema.ts
  routes/todo.routes.ts
  main.ts             # register routes & listen
```

## Script

| Command | Deskripsi |
|---------|-----------|
| `pnpm dev` | dev dengan `tsx watch` |
| `pnpm build` | `tsc` ke `dist/` |
| `pnpm start` | jalankan `node dist/main.js` |

## Best Practice Sudah Termasuk

* `skipLibCheck`, `strict`, `noImplicitAny` — tanpa `any`
* `.editorconfig` & `.gitignore` Node
* `removeAdditional: 'all'` — anti field injection

## Kapan Tidak Perlu AJV?

Butuh validasi 1 field doang? `if` aja. Repo ini untuk yang butuh **skala + kecepatan + pesan error konsisten**.

---

MIT — pakai aja, gratis.
