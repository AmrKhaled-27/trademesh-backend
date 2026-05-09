import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create 3 Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
      balance: 500.0,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: hashedPassword,
      balance: 300.0,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      password: hashedPassword,
      balance: 1000.0,
    },
  });

  const users = [user1, user2, user3];

  // 2. Seed Products
  // Total of 12 products (4 per user)
  // Each user will have: 1 for_sale, 2 sold (to different buyers), 1 bought (from another user)

  const productsData = [
    // Alice's Products
    {
      name: 'Mechanical Keyboard RGB',
      description: 'High performance gaming keyboard',
      brand: 'Corsair',
      price: 120.0,
      status: 'for_sale',
      ownerId: user1.id,
      mainImage: 'https://picsum.photos/500?random=1',
    },
    {
      name: 'Gaming Mouse',
      description: '10000 DPI wireless mouse',
      brand: 'Logitech',
      price: 50.0,
      status: 'sold',
      ownerId: user1.id,
      buyerId: user2.id,
      mainImage: 'https://picsum.photos/500?random=2',
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 adapter for MacBooks',
      brand: 'Anker',
      price: 35.0,
      status: 'sold',
      ownerId: user1.id,
      buyerId: user3.id,
      mainImage: 'https://picsum.photos/500?random=3',
    },

    // Bob's Products
    {
      name: 'Noise Cancelling Headphones',
      description: 'Over-ear headphones with ANC',
      brand: 'Sony',
      price: 250.0,
      status: 'for_sale',
      ownerId: user2.id,
      mainImage: 'https://picsum.photos/500?random=4',
    },
    {
      name: 'Webcam 4K',
      description: 'Ultra HD streaming camera',
      brand: 'Razer',
      price: 180.0,
      status: 'sold',
      ownerId: user2.id,
      buyerId: user1.id, // Alice bought this
      mainImage: 'https://picsum.photos/500?random=5',
    },
    {
      name: 'Monitor Light Bar',
      description: 'Eye-care desk lamp',
      brand: 'BenQ',
      price: 99.0,
      status: 'sold',
      ownerId: user2.id,
      buyerId: user3.id,
      mainImage: 'https://picsum.photos/500?random=6',
    },

    // Charlie's Products
    {
      name: 'Ergonomic Desk Chair',
      description: 'Adjustable office chair',
      brand: 'Herman Miller',
      price: 850.0,
      status: 'for_sale',
      ownerId: user3.id,
      mainImage: 'https://picsum.photos/500?random=7',
    },
    {
      name: 'UltraWide Monitor',
      description: '34-inch curved gaming monitor',
      brand: 'LG',
      price: 600.0,
      status: 'sold',
      ownerId: user3.id,
      buyerId: user1.id, // Alice bought this
      mainImage: 'https://picsum.photos/500?random=8',
    },
    {
      name: 'Phone Stand',
      description: 'Aluminum portable stand',
      brand: 'Lamicall',
      price: 15.0,
      status: 'sold',
      ownerId: user3.id,
      buyerId: user2.id, // Bob bought this
      mainImage: 'https://picsum.photos/500?random=9',
    },

    // A few more for-sale products to reach >10
    {
      name: 'Laptop Sleeve',
      description: 'Waterproof 13 inch sleeve',
      brand: 'Tomtoc',
      price: 25.0,
      status: 'for_sale',
      ownerId: user1.id,
      mainImage: 'https://picsum.photos/500?random=10',
    },
    {
      name: 'Mechanical Pencil Set',
      description: 'Drafting pencils 0.5mm',
      brand: 'Pentel',
      price: 12.0,
      status: 'for_sale',
      ownerId: user2.id,
      mainImage: 'https://picsum.photos/500?random=11',
    },
    {
      name: 'Smart Water Bottle',
      description: 'Hydration tracking bottle',
      brand: 'HidrateSpark',
      price: 60.0,
      status: 'for_sale',
      ownerId: user3.id,
      mainImage: 'https://picsum.photos/500?random=12',
    },
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
