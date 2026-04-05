# Project Context: Distributed Online Marketplace

## 1. Project Overview

This project is a backend system for a distributed online marketplace (developed for a university course). The platform allows users to act as both buyers and sellers. Users can manage a virtual wallet, list items for sale, search for items, and purchase items. Additionally, the system provides a public-facing API that allows external "Partner Stores" to fetch the marketplace's inventory and sell products on their own platforms.

## 2. Tech Stack Constraints

- **Runtime:** Node.js (Vanilla JavaScript, ES6 Modules - NO TypeScript).
- **Framework:** Express.js.
- **Database:** PostgreSQL.
- **ORM:** Prisma.
- **Data Validation:** Zod (used to validate incoming request bodies/params before they hit the database/Prisma).
- **File Uploads:** Multer (specifically for parsing CSV files for bulk product uploads).
- **External Web Services:** Standard REST APIs to serve the Partner Store interface.

## 4. Business Logic & Feature Flows

### A. Authentication & User Management

- Users can create an account and log in.
- **2FA (Bonus Feature):** Critical actions, like initial registration and confirming large purchases, should trigger an OTP (One-Time Password) sent via email.
- Users can view their profile, current wallet balance, and historical data.

### B. Wallet & Virtual Economy

- Users can deposit virtual cash into their account. (This simply increments their balance and creates a "Deposit" transaction record).
- **No negative balances:** A user cannot purchase an item if their balance is lower than the item's price.

### C. Inventory & Product Management

- Users can add, edit, or remove their own products.
- **CSV Bulk Upload:** Users can upload a `.csv` file. The backend must parse this file and insert multiple products into the user's inventory at once.
- Users can browse a global feed of available items.
- Search logic: Users must be able to perform basic text searches filtering by "Item Name" and "Brand".

### D. The Purchasing Mechanism (Critical Flow)

When User A (Buyer) buys an Item from User B (Seller), the backend must perform a transactional update:

1. Verify Buyer has enough cash.
2. Verify Item is still available.
3. Deduct Item Price from Buyer's wallet.
4. Add Item Price to Seller's wallet.
5. Change Item ownership (Assign Item to Buyer) OR mark Item as "Sold".
6. Generate a Transaction record for the ledger.
   _Note for Agent: This must be handled as an atomic database transaction via Prisma to prevent data anomalies._

### E. Partner Store Web Services (Third-Party Integrations)

- The system must allow users/developers to generate an API Key.
- The system must expose specific REST/SOAP endpoints for external use:
  - **Fetch Inventory:** External stores can request a list of available products.
  - **Remote Purchase:** External stores can hit an endpoint (authenticating via their API key) to trigger the purchasing mechanism for a specific item, deducting from the appropriate accounts.

### F. Analytics & Reporting

- The system must be able to generate reports based on the Transaction ledger.
- A user should be able to query their own transaction history (e.g., "List of purchased items", "List of sold items", "Deposit history").

## 5. Guidelines for the Coding Agent

- **Simplicity over complexity:** We are building this for a university project. Do not over-engineer the architecture (e.g., no CQRS, no complex Domain-Driven Design). Keep routing, controllers, and Prisma logic straightforward.
- **Security:** Passwords must be hashed (e.g., bcrypt). API keys must be securely verified via middleware.
- **Validation:** Always use Zod to parse `req.body` and `req.params` before performing business logic.
- **Error Handling:** Ensure API responses follow a consistent JSON format for errors (e.g., `{ success: false, message: "..." }`).
- **JS docs:** we should put js docs on all functions since we are using vanilla javascript
