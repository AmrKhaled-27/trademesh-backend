import { prisma } from '../../utils/prisma.js';

/**
 * Calculates the financial summary for a given user:
 * - totalRevenue:  sum of amounts received via selling_operation transactions
 * - totalSpent:    sum of amounts sent via selling_operation transactions
 * - walletBalance: current wallet balance from User record
 */
export const getFinancialSummary = async (userId) => {
  // Run all three queries in parallel for efficiency
  const [revenueAgg, spentAgg, user] = await Promise.all([
    // Total revenue = money received from sales
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        receiverId: userId,
        type: 'selling_operation',
      },
    }),

    // Total spent = money sent for purchases
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        senderId: userId,
        type: 'selling_operation',
      },
    }),

    // Current wallet balance
    prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    }),
  ]);

  return {
    totalRevenue: revenueAgg._sum.amount || 0,
    totalSpent: spentAgg._sum.amount || 0,
    walletBalance: user?.balance || 0,
  };
};

/**
 * Groups revenue and expenses by day for the last N days.
 * Returns an array sorted by date ascending, suitable for charting.
 *
 * Each entry: { date: 'YYYY-MM-DD', revenue: number, expenses: number }
 */
export const getSalesOverTime = async (userId, days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  // Fetch all selling_operation transactions for this user within the window
  const transactions = await prisma.transaction.findMany({
    where: {
      type: 'selling_operation',
      createdAt: { gte: since },
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    select: {
      amount: true,
      senderId: true,
      receiverId: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Bucket by date string
  const buckets = {};

  for (const tx of transactions) {
    const dateKey = tx.createdAt.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    if (!buckets[dateKey]) {
      buckets[dateKey] = { date: dateKey, revenue: 0, expenses: 0 };
    }

    if (tx.receiverId === userId) {
      buckets[dateKey].revenue += tx.amount;
    }
    if (tx.senderId === userId) {
      buckets[dateKey].expenses += tx.amount;
    }
  }

  // Return sorted array
  return Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Returns the top 5 most-sold products owned by this user.
 * "Most sold" = appeared in the most selling_operation transactions.
 */
export const getTopProducts = async (userId) => {
  // Find all selling_operation transactions where the user was the seller (receiver of money)
  const transactions = await prisma.transaction.findMany({
    where: {
      receiverId: userId,
      type: 'selling_operation',
      productId: { not: null },
    },
    select: {
      productId: true,
    },
  });

  // Count occurrences per product
  const countMap = {};
  for (const tx of transactions) {
    countMap[tx.productId] = (countMap[tx.productId] || 0) + 1;
  }

  // Sort by count descending, take top 5
  const topProductIds = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topProductIds.length === 0) return [];

  // Fetch product details
  const products = await prisma.product.findMany({
    where: {
      id: { in: topProductIds.map(([id]) => Number(id)) },
    },
    select: {
      id: true,
      name: true,
      mainImage: true,
      brand: true,
      price: true,
    },
  });

  // Merge count into results, preserving sort order
  return topProductIds.map(([id, salesCount]) => {
    const product = products.find((p) => p.id === Number(id));
    return {
      ...product,
      salesCount,
    };
  });
};
