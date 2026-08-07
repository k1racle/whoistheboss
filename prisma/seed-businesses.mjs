import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function placeholder(width, height, bg, text) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="${Math.min(width, height) / 4}" font-family="sans-serif" font-weight="bold">${text}</text></svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

const businesses = [
  {
    slug: 'selderey',
    name: 'СЕЛЬДЕРЕЙ',
    type: 'КАФЕ-БАР',
    description: '<p>Салат-бар здоровых привычек в самом центре города.</p>',
    city: 'Москва',
    address: 'ул. Большая Никитская, 15',
    phone: '+7 (495) 111-11-11',
    email: 'hello@selderey.ru',
    website: 'https://selderey.ru',
    color: '#3d8b37',
    text: 'СБ',
  },
  {
    slug: 'zanoza-open-bar',
    name: 'ZANOZA OPEN BAR',
    type: 'БАР',
    description: '<p>Открытый бар с авторской кухней и живой атмосферой.</p>',
    city: 'Москва',
    address: 'ул. Малая Бронная, 22',
    phone: '+7 (495) 222-22-22',
    email: 'hello@zanoza.ru',
    website: 'https://zanoza.ru',
    color: '#b52200',
    text: 'ZO',
  },
  {
    slug: 'big-baby-burger',
    name: 'BIG BABY BURGER',
    type: 'БУРГЕРНАЯ',
    description: '<p>Бургерная, где мясо жарят на открытом огне.</p>',
    city: 'Москва',
    address: 'ул. Пятницкая, 30',
    phone: '+7 (495) 333-33-33',
    email: 'hello@bigbaby.ru',
    website: 'https://bigbaby.ru',
    color: '#8c5a1f',
    text: 'BB',
  },
];

async function main() {
  const entrepreneurs = await prisma.entrepreneur.findMany({
    where: { isPublished: true },
    select: { id: true, slug: true },
    orderBy: { createdAt: 'asc' },
  });

  if (entrepreneurs.length === 0) {
    throw new Error('Нет предпринимателей. Сначала запустите основной seed: node prisma/seed.mjs');
  }

  for (let i = 0; i < businesses.length; i++) {
    const b = businesses[i];
    const entrepreneur = entrepreneurs[i % entrepreneurs.length];

    await prisma.business.upsert({
      where: { slug: b.slug },
      update: {
        coverImage: placeholder(1200, 675, b.color, b.text),
      },
      create: {
        slug: b.slug,
        name: b.name,
        type: b.type,
        description: b.description,
        city: b.city,
        address: b.address,
        phone: b.phone,
        email: b.email,
        website: b.website,
        coverImage: placeholder(1200, 675, b.color, b.text),
        entrepreneurId: entrepreneur.id,
        isPublished: true,
      },
    });
  }

  console.log(`Seeded ${businesses.length} businesses`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
