import { prisma } from '../../utils/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { decrementBalance, incrementBalance } from '../wallet/wallet.service.js';
import { createTransaction } from '../transaction/transaction.service.js';

class CheckoutService {
  async checkout(buyerId, { productId }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Get product and check status
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { owner: true },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      if (product.status !== 'for_sale') {
        throw new AppError('Product is no longer available', 400);
      }

      if (product.ownerId === buyerId) {
        throw new AppError('You cannot buy your own product', 400);
      }

      // 2. Withdraw from buyer (this checks balance internally)
      await decrementBalance(buyerId, product.price, tx);

      // 3. Deposit to seller
      await incrementBalance(product.ownerId, product.price, tx);

      // 4. Update product status and buyer ID
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          status: 'sold',
          buyerId: buyerId,
        },
      });

      // 5. Record the selling operation transaction
      await createTransaction(
        {
          type: 'selling_operation',
          amount: product.price,
          senderId: buyerId,
          receiverId: product.ownerId,
          productId: productId,
        },
        tx,
      );

      return updatedProduct;
    });
  }
}

export default new CheckoutService();
