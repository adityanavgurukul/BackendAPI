# API Documentation

## Authentication API Endpoints

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
# API Documentation

Short reference for the BackendAPI service.

Base URL
- `http://localhost:5000` (default) — configured via `PORT` and `MONGODB_URI` in env.

Authentication
- Token: JWT returned from `POST /api/auth/login`.
- Send as header: `Authorization: Bearer <token>`.

**Auth**

- `POST /api/auth/register` — Register a new user
  - Body (JSON): `{ "username": "string", "email": "string", "password": "string" }`
  - Success: `201` `{ message: 'User created successfully', userId: '<id>' }`
  - Errors: `400` for invalid input or duplicate email

- `POST /api/auth/login` — Login
  - Body (JSON): `{ "email": "string", "password": "string" }`
  - Success: `200` `{ message, token, user: { id, username, email } }`
  - Errors: `400` for invalid credentials

- `GET /api/auth/validate` — Validate token (protected)
  - Header: `Authorization: Bearer <token>`
  - Success: `200` `{ isValid: true, user: { id, username, email } }`
  - Errors: `401` if token missing/invalid

**Products**

- `GET /api/products` — List all products
  - Success: `200` `{ success: true, count, data: [ Product ] }`

- `GET /api/products/:id` — Get product by ID
  - Params: `id` (numeric or string as used in `_id` field)
  - Success: `200` `{ success: true, data: Product }`
  - Errors: `404` if not found, `400` for invalid id format

- `POST /api/products` — Create product
  - Body (JSON): `{ "title", "price", "description", "category", "image" }`
  - Success: `201` `{ success: true, data: Product }`
  - Errors: `400` validation errors

- `PUT /api/products/:id` — Update product
  - Body (JSON): any of `{ title, price, description, category, image, favourite }`
  - Success: `200` `{ success: true, data: Product }`
  - Errors: `404` not found, `400` validation/invalid id

- `DELETE /api/products/:id` — Delete product
  - Success: `200` `{ success: true }`
  - Errors: `404` not found, `400` invalid id

Product model fields (summary):
- `_id`, `title` (string), `price` (number), `description` (string), `category` (string), `image` (string), `rating` (object), `favourite` (boolean)

**Todos**

- `GET /api/todos` — List all todos
  - Success: `200` `[{ Todo }]`

- `POST /api/todos` — Create todo
  - Body (JSON): `{ "title": "string", "completed": false }`
  - Success: `201` `Todo`

- `GET /api/todos/:id` — Get a todo
  - Success: `200` `Todo` or `404` if not found

- `PUT /api/todos/:id` — Update a todo
  - Body (JSON): any of `{ title, description, completed }`
  - Success: `200` updated `Todo`

- `DELETE /api/todos/:id` — Delete a todo
  - Success: `200` `{ message: 'Todo deleted successfully' }`

Todo model fields (summary): `title`, `description`, `completed`

Notes
- Only `GET /api/auth/validate` uses the `verifyToken` middleware in routes — include `Authorization` header when required. `productRoutes` and `todos` currently do not require authentication.
- Error responses typically include `{ message }` or `{ success: false, error }` depending on the route.

Examples

Login request:
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "secret"
}
```

Create product request:
```json
POST /api/products
{
  "title": "Example",
  "price": 9.99,
  "description": "Short desc",
  "category": "general",
  "image": "https://..."
}
```

See route implementations in `routes/` for full behavior and validation messages.
