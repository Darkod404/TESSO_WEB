# TESSO WEB

Front React + Vite de la tienda TESSO.

## Rama de trabajo

Desarrollo activo en **`development`**. `main` para releases.

## Variables de entorno

```bash
cp .env.example .env.development
```

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | Base URL del API (sin slash final) |
| `VITE_USE_MOCK_CATALOG` | `true` = mock local; `false` = consume TESSO_API |

## Scripts

```bash
npm install
npm run dev
```

## ¿El front consume el back?

Sí está cableado (`catalogApi`, `authApi`, `orderApi`, `paymentApi`), pero por defecto **`VITE_USE_MOCK_CATALOG=true`**, así que el catálogo sigue en mock hasta que el API esté arriba y pongas `false`.

Checkout ya crea pedido + payment intent contra el API (requiere API corriendo).

## Checkout

Soporta **guest** y **cuenta** (login/registro en la misma pantalla).
