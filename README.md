# Trademesh Marketplace Backend

Trademesh is a distributed online marketplace designed specifically to facilitate transactions using a virtual economy system where wallets hold virtual balances instead of direct fiat interactions. This platform offers robust user authentication, a secure wallet implementation, product management algorithms, and seamless API documentation via Swagger.

## Distributed Architecture (Smart Gateway + TCP Monolith)

To satisfy advanced distributed systems requirements, this project follows an **Edge Gateway Pattern**. Standard HTTP REST traffic is intercepted by a Smart Gateway, parsed, validated, and finally transmitted via raw TCP sockets to the internal monolithic backend.

```
trademesh-backend/
├── prisma/                 # Database schema and migrations
├── src/
│   ├── config/             # Zod environment variable parsing/validation
│   ├── gateway/            # External HTTP Edge Gateway
│   │   ├── gateway.js      # Express server entry point
│   │   ├── forwarder.js    # Utility mapping HTTP paths to TCP Actions
│   │   ├── tcpClient.js    # Raw net.Socket wrapper
│   │   ├── docs/           # OpenAPI/Swagger configurations
│   │   └── middlewares/    # Authentication & Zod payload validation
│   ├── tcp-server/         # Internal Monolithic Core
│   │   ├── server.js       # Raw TCP net.createServer entry point
│   │   └── actions.js      # TCP Action dispatcher
│   ├── utils/              # Tools (Prisma client singleton, AppErrors)
│   └── modules/            # The core feature domains!
│       ├── auth/           # All Auth related logic
│       ├── user/           # Database interactions for users
│       └── mailing/        # Mail server actions (Nodemailer OTP)
```

**Adding a New Module:**
When you add a new feature (e.g., `wallet`), you create `/src/modules/wallet/`. Inside it, you maintain feature separation:

- _Gateway Side_: `wallet.routes.js` and `wallet.dto.js` handle Express HTTP routing and Zod payload validation.
- _TCP Side_: `wallet.controller.js` and `wallet.service.js` handle business logic and DB operations without ever touching HTTP.
- _Docs_: `wallet.docs.js` maintains Swagger documentation definitions.

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
Configure your `.env` file according to `src/config/env.js`. You will need:

- `DATABASE_URL`
- `SMTP` configurations
- `TCP_PORT` and `TCP_HOST` (Defaults to 5000 and 127.0.0.1)

**3. Database Sync**

```bash
# Push Prisma schema to your PostgreSQL database (Automatically runs prisma generate)
npx prisma db push

# (Optional) Fully reset/drop the database and re-push the schema
npx prisma db push --force-reset
```

**4. Start the Application Processes**
Because the system operates a strict edge-gateway to backend-socket flow, you must run both endpoints:

```bash
# Terminal 1: Boot the internal TCP Server
npm run dev:tcp

# Terminal 2: Boot the external HTTP Gateway
npm run dev:gateway
```

**API Documentation:**
Once the Gateway is running, navigate to `http://localhost:3000/api-docs` to interact with the Swagger visual sandbox.
