CREATE TABLE "Checkout" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Checkout_productId_key" ON "Checkout"("productId");

ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_buyerId_fkey"
FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;