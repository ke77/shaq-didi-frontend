# ShaQ DIDI Frontend + Laravel API

The React app in this project calls the Laravel API in the sibling `shaq-didi` project. The integration uses Sanctum personal access tokens; it does not use cookie-based SPA authentication or a CSRF-cookie request.

## Local configuration

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Laravel `.env`:

```env
APP_URL=http://localhost:8000
```

The backend CORS configuration currently allows the frontend dev origins on ports `3000` and `5173`. The frontend Vite script runs on port `3000`.

## API contract

| Purpose | Endpoint | Access |
|---|---|---|
| Register | `POST /api/auth/register` | Public |
| Sign in | `POST /api/auth/login` | Public |
| Catalogue products | `GET /api/products` | Authenticated bearer token |
| Current profile | `GET /api/me` | Bearer token |
| Sign out | `POST /api/auth/logout` | Bearer token |
| Restaurants | `GET /api/restaurants` | Bearer token |
| Restaurant menu | `GET /api/restaurants/{restaurant}/products` | Bearer token |
| Dispatch personnel | `GET /api/personnel` | Permanent Staff bearer token |
| Place order | `POST /api/place-order` | Permanent Staff bearer token |
| Order history | `GET /api/orders` | Bearer token; scoped by role |
| Complete assigned order | `PATCH /api/orders/{order}/complete` | Assigned NSP bearer token |
| Cancel pending order | `PATCH /api/orders/{order}/cancel` | Owning Permanent Staff bearer token |
| Today's assigned orders | `GET /api/orders/today` | National Service bearer token |

After login or registration, the API returns a personal access token. The frontend stores it and sends `Authorization: Bearer <token>` on protected requests. The server remains authoritative for the user's role and permissions.

An order request uses product and personnel IDs from the API:

```json
{
  "product_id": 1,
  "amount": 2,
  "order_note": "Call on arrival",
  "personnel_id": 3
}
```

Here, `amount` is the integer quantity (1–500), not a user-entered price. The backend determines the product price and total. Product and order prices are stored in pesewas; the frontend displays them in Ghana cedis.

## Run locally

From `shaq-didi`:

```powershell
php artisan migrate --seed
php artisan serve --port=8000
```

From `shaq-didi-frontend`:

```powershell
npm run dev
```

For local development only, the seed data creates `ps@example.com` and `nsp@example.com`; both use the factory password `password`.

The frontend registers and signs in against the API, loads the authenticated user's catalogue, personnel list, and role-scoped order history, then sends all order changes to the backend.
