# Trademesh Marketplace Backend

Trademesh is a distributed online marketplace designed specifically to facilitate transactions using a virtual economy system where wallets hold virtual balances instead of direct fiat interactions. This platform offers robust user authentication, a secure wallet implementation, product management algorithms, and seamless API documentation via Swagger.

## Architecture & Structure

This project follows a strict **Feature-based Modular Architecture** designed for scalability and rapid development without cluttering centralized controllers.

```
trademesh-backend/
├── prisma/                 # Database schema and migrations
├── src/
│   ├── config/             # Zod environment variable parsing/validation
│   ├── docs/               # OpenAPI/Swagger centralized configuration
│   ├── middlewares/        # Global interceptors (Validation, Errors, etc.)
│   ├── utils/              # Tools (Prisma client singleton, AppErrors, async handlers)
│   └── modules/            # The core features!
│       ├── auth/           # All Auth related logic
│       ├── user/           # Database interactions for users
│       └── mailing/        # Mail server actions (Nodemailer OTP)
```

**Adding a New Module:**
When you add a new feature (e.g., `wallet`), you create `/src/modules/wallet/`. Inside it, you maintain full separation of concerns by creating:

- `wallet.routes.js`: Defines Express paths.
- `wallet.controller.js`: Clean HTTP handlers (use the `asyncHandler` wrapper).
- `wallet.service.js`: Business Logic and Prisma database access.
- `wallet.dto.js`: Zod schema validation payloads.
- `wallet.docs.js`: Swagger documentation definitions.

## Prerequisites

1.  **Node.js** (v18+)
2.  **PostgreSQL** Database
3.  **Gmail App Password** (for sending OTPs via Nodemailer)

## Setup & Execution

**1. Install Dependencies**

```bash
npm install
```

**2. Setup Environment Variables**
Configure your `.env` file according to `src/config/env.js`. You will need `DATABASE_URL` and `SMTP` configs.

**3. Database Sync**

```bash
# Push Prisma schema to your PostgreSQL database (Automatically runs prisma generate)
npx prisma db push

# (Optional) Fully reset/drop the database and re-push the schema
npx prisma db push --force-reset
```

**4. Start the Application**

```bash
# For active development (automatically restarts via Nodemon)
npm run dev
```

**API Documentation:**
Once running, navigate to `http://localhost:3000/api-docs` to interact with the Swagger visual sandbox.
