# Express JWT API - Modern Implementation

A modern REST API built with Express.js, JWT authentication, Knex query builder, Objection ORM, and MySQL database. Features role-based access control (RBAC) with permissions management.

## Tech Stack

- **Express.js** 4.21.2 - Fast, minimalist web framework
- **JWT** (jsonwebtoken 9.0.2) - Secure authentication
- **Knex** 3.1.0 - SQL query builder
- **Objection.js** 3.1.5 - ORM built on Knex
- **MySQL2** 3.11.5 - Database driver
- **Passport JWT** 4.0.1 - JWT authentication strategy
- **bcrypt** 5.1.1 - Password hashing
- **express-validator** 7.2.1 - Request validation
- **Swagger** - OpenAPI 3.0 documentation

## Features

- JWT-based authentication with Bearer tokens
- Role-based access control (Admin/User roles)
- Permission-based authorization
- Password hashing with bcrypt
- Request validation with express-validator
- RESTful API design
- OpenAPI/Swagger documentation
- CORS support
- Database migrations and seeding
- Error handling middleware
- Graceful shutdown

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL >= 5.7 or 8.0

## Installation

### 1. Clone and Install Dependencies

```bash
cd express-jwt
npm install
```

### 2. Configure Environment

```bash
cp .env.dist .env
```

Edit `.env` with your configuration:

```env
PORT=8000
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=express_jwt_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=86400

# CORS
CORS_ORIGIN=*

# Bcrypt
BCRYPT_ROUNDS=10
```

### 3. Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE express_jwt_db;"

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Server runs at: **http://localhost:8000**

### Production Mode

```bash
NODE_ENV=production npm start
```

## API Documentation

When running in development mode, access interactive API docs:

**Swagger UI**: http://localhost:8000/api-docs

## Default Users

After seeding, you can login with:

**Admin User:**
- Username: `admin`
- Password: `Password@01`

**Demo User:**
- Username: `demo`
- Password: `Password@01`

## API Endpoints

### Authentication

```bash
POST /auth/login
```

### Admin Routes (Requires admin role)

```bash
GET    /admin/users
POST   /admin/users
GET    /admin/users/:id
PUT    /admin/users/:id
DELETE /admin/users/:id

GET    /admin/roles
POST   /admin/roles
GET    /admin/roles/:id
PUT    /admin/roles/:id
DELETE /admin/roles/:id

GET    /admin/permissions
POST   /admin/permissions
GET    /admin/permissions/:id
PUT    /admin/permissions/:id
DELETE /admin/permissions/:id
```

### User Routes (Requires user or admin role)

```bash
GET /user/profile
PUT /user/profile
```

## Example Usage

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Password@01"
  }'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": {
      "id": 1,
      "role": "admin",
      "description": "Administrator"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expire_in": 86400
}
```

### Access Protected Route

```bash
curl -X GET http://localhost:8000/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## NPM Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run migrate        # Run database migrations
npm run migrate:rollback  # Rollback last migration
npm run seed           # Seed database with initial data
```

## Database Schema

### Tables

- **roles** - User roles (admin, user, etc.)
- **permissions** - Permission definitions with actions
- **users** - User accounts with hashed passwords

### Relationships

- Users belong to one Role
- Roles have many Permissions
- Roles have many Users

## Project Structure

```
express-jwt/
├── db/
│   ├── migrations/          # Knex migrations
│   ├── seeds/              # Database seeders
│   └── index.js            # Database connection
├── models/
│   ├── User.js             # User model
│   ├── Role.js             # Role model
│   ├── Permission.js       # Permission model
│   └── Auth.js             # Auth types
├── server/
│   ├── middleware/
│   │   └── authGuard.js    # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js         # Auth routes
│   │   ├── admin/          # Admin routes
│   │   └── user/           # User routes
│   └── server.js           # Express app setup
├── .env.dist               # Environment template
├── knexfile.js             # Knex configuration
├── package.json
└── README.md
```

## Security Features

- Passwords hashed with bcrypt
- JWT token expiration
- Bearer token authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention via Objection ORM
- CORS configuration
- Environment variable protection

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Authentication failed",
  "message": "Invalid credentials"
}
```

## Troubleshooting

### MySQL Authentication Error

If you get "Client does not support authentication protocol":

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### Port Already in Use

Change the `PORT` in your `.env` file to a different port.

### Migration Errors

Reset the database:

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS express_jwt_db; CREATE DATABASE express_jwt_db;"
npm run migrate
npm run seed
```

## License

ISC

## Author

sekseason

---

**Version**: 2.0.0
**Updated**: 2025-10-11