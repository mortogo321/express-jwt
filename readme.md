# Express JWT API

A Node.js REST API demonstrating JWT authentication with role-based access control (RBAC), built on Express, Objection.js/Knex, and MySQL.

## What's Inside

- JWT login (`POST /auth/login`) issuing signed Bearer tokens (24h expiry)
- Passport-JWT strategy enforcing per-route role checks via an `authGuard` middleware
- Role-based access control: `admin` / `user` roles, with permissions linked to roles
- Admin CRUD APIs for users, roles, and permissions
- Read-only user profile endpoint
- Password hashing with bcrypt
- Request validation with express-validator
- Swagger/OpenAPI docs served at `/api-docs` in development
- Knex migrations and seeders for the roles/permissions/users schema

Note: `POST /auth/refresh` exists as a route but currently returns `501 Not Implemented`.

## Tech Stack

- Express (5.x)
- `jsonwebtoken` + `passport-jwt` for JWT authentication
- Objection.js on top of Knex (ORM + query builder)
- MySQL via `mysql2`
- bcrypt for password hashing
- express-validator for input validation
- swagger-jsdoc / swagger-ui-express for API documentation

## Quickstart

Requirements: Node.js >= 18, MySQL 5.7+ or 8.

```bash
git clone <repo-url>
cd express-jwt
yarn install

cp .env.dist .env
# set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET in .env

mysql -u root -p -e "CREATE DATABASE express_jwt_db;"
yarn migrate
yarn seed

yarn dev
# API: http://localhost:8000
# Swagger UI: http://localhost:8000/api-docs
```

Seeding creates two accounts, both with password `Password@01`:
- `admin` (admin role)
- `demo` (user role)

Login example:

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Password@01"}'
```

The response includes a Bearer `token` used for subsequent authenticated requests.

## API Surface

**Auth**
- `POST /auth/login`
- `POST /auth/refresh` (placeholder, returns 501)

**Admin** — requires JWT with `admin` role
- `/admin/users`, `/admin/roles`, `/admin/permissions` — each supports list, create, get-by-id, update, delete

**User** — requires JWT with `user` or `admin` role
- `GET /user/profile` (read-only stub)

## Project Structure

```
db/            Knex config, migrations, and seeders
models/        Objection.js models (User, Role, Permission)
server/
  middleware/  authGuard.js — Passport JWT strategy + role guard
  routes/      auth, admin/*, user/* route handlers
```

## License

ISC
