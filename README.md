# Motirõ Study System

Class scheduling system

## Technologies

- Node
- Typescript
- Express
- Mongoose
- Bcrypt
- Cookie Parser
- Dotenv
- Express Async Errors
- Jsonwebtoken
- Validator
- Docker Compose
- Swagger
- Prettier

## Architecture

```
├── src/
│   ├── applications/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── usecases/
│   │
│   ├── domain/
│   │   ├── entities/
│   │   └── repositories/
│   │
│   ├── infrastructure/
│   │   ├── authentication/
│   │   │   └── jwt
│   │   └── persistence/
│   │       └── mongo/
│   │           ├── models/
│   │           └── repositories/
│   │
│   ├── routes/
│   │
│   ├── index.ts
│   └── swagger.json
│
├── public/
│   └── uploads/
│
└── test/
```

## Environment variables

To run this project, you will need to add the following environment variables to your .env

```bash
# Server
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=mss

# Mongo Express
MONGO_EXPRESS_PORT=8081

# Bcrypt
BCRYPT_SALT=10

# JWT
JWT_SECRET='somesecret'
JWT_LIFETIME='60m'

# Cookie Parser
COOKIE_SECRET="$JWT_SECRET"
```

## Run the application

Before you begin, you will need to have Docker Compose installed on your machine.

Clone this repository

```bash
  git clone https://github.com/motiro/motiro-study-system
```

Access the project folder

```bash
  cd motiro-study-system
```

Run the application

```bash
  docker compose up
```

Documentation

```bash
  http://localhost:5000/docs
```

## Upload files to lessons

- The file must be of type text, PDF or odt/doc/docx
- File must not exceed 5MB
- Use `document` as the key name to upload the file using Postman or Insomnia

```bash
  http://localhost:5000/api/v1/lesson/:id/upload
```
