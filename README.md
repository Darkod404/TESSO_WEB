# TESSO WEB

Front React + Vite de la tienda TESSO.

## Rama de trabajo

Desarrollo activo en **`development`**. `main` para releases.

## API

```bash
# .env.development (ya incluido en el repo de ejemplo)
VITE_API_URL=http://localhost:8080
```

Cuando `TESSO_API` esté corriendo, en `src/data/mockCatalog.ts`:

```ts
export const USE_TEMPORARY_MOCK_CATALOG = false
```

## Scripts

```bash
npm install
npm run dev
```

## Checkout (próximo)

Soportará **guest** (sin cuenta) y **cuenta** (historial / direcciones / diseños).
