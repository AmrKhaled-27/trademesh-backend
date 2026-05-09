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
      images: [
        'https://picsum.photos/500?random=101',
        'https://picsum.photos/500?random=102',
        'https://picsum.photos/500?random=103',
        'https://picsum.photos/500?random=104',
      ],
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
      images: [
        'https://picsum.photos/500?random=105',
        'https://picsum.photos/500?random=106',
        'https://picsum.photos/500?random=107',
        'https://picsum.photos/500?random=108',
      ],
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
      images: [
        'https://picsum.photos/500?random=109',
        'https://picsum.photos/500?random=110',
        'https://picsum.photos/500?random=111',
        'https://picsum.photos/500?random=112',
      ],
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
      images: [
        'https://picsum.photos/500?random=113',
        'https://picsum.photos/500?random=114',
        'https://picsum.photos/500?random=115',
        'https://picsum.photos/500?random=116',
      ],
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
      images: [
        'https://picsum.photos/500?random=117',
        'https://picsum.photos/500?random=118',
        'https://picsum.photos/500?random=119',
        'https://picsum.photos/500?random=120',
      ],
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
      images: [
        'https://picsum.photos/500?random=121',
        'https://picsum.photos/500?random=122',
        'https://picsum.photos/500?random=123',
        'https://picsum.photos/500?random=124',
      ],
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
      images: [
        'https://picsum.photos/500?random=125',
        'https://picsum.photos/500?random=126',
        'https://picsum.photos/500?random=127',
        'https://picsum.photos/500?random=128',
      ],
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
      images: [
        'https://picsum.photos/500?random=129',
        'https://picsum.photos/500?random=130',
        'https://picsum.photos/500?random=131',
        'https://picsum.photos/500?random=132',
      ],
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
      images: [
        'https://picsum.photos/500?random=133',
        'https://picsum.photos/500?random=134',
        'https://picsum.photos/500?random=135',
        'https://picsum.photos/500?random=136',
      ],
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
      images: [
        'https://picsum.photos/500?random=137',
        'https://picsum.photos/500?random=138',
        'https://picsum.photos/500?random=139',
        'https://picsum.photos/500?random=140',
      ],
    },
    {
      name: 'Mechanical Pencil Set',
      description: 'Drafting pencils 0.5mm',
      brand: 'Pentel',
      price: 12.0,
      status: 'for_sale',
      ownerId: user2.id,
      mainImage: 'https://picsum.photos/500?random=11',
      images: [
        'https://picsum.photos/500?random=141',
        'https://picsum.photos/500?random=142',
        'https://picsum.photos/500?random=143',
        'https://picsum.photos/500?random=144',
      ],
    },
    {
      name: 'Smart Water Bottle',
      description: 'Hydration tracking bottle',
      brand: 'HidrateSpark',
      price: 60.0,
      status: 'for_sale',
      ownerId: user3.id,
      mainImage: 'https://picsum.photos/500?random=12',
      images: [
        'https://picsum.photos/500?random=145',
        'https://picsum.photos/500?random=146',
        'https://picsum.photos/500?random=147',
        'https://picsum.photos/500?random=148',
      ],
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
