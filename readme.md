## Express JWT + Knex + Objection + Mysql

- Express
- JWT
- Knex
- Objection
- MySQL

#### Installation

Prerequisite:

```
npm install -g nodemon
npm install -g knex
```

Clone the source from this repo

```
cd express-jwt
cp .env.dist .env

# then, configure your `.env` file

npm install | yarn
knex migrate:latest
knex seed:run
```

#### Run

```
cd express-jwt
npm run dev | yarn dev
```

as default you can access api at http://localhost:3000  
view api docs at http://localhost:3000/api-docs (development only)

default user  
u: admin  
p: Password@01

u: demo  
p: Password@01