import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'admin123';

function placeholder(width, height, bg, text) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="${Math.min(width, height) / 4}" font-family="sans-serif" font-weight="bold">${text}</text></svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

async function main() {
  const password = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: 'admin@guessboss.local' },
    update: {},
    create: {
      email: 'admin@guessboss.local',
      password,
      name: 'Администратор',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'editor@guessboss.local' },
    update: {},
    create: {
      email: 'editor@guessboss.local',
      password,
      name: 'Редактор',
      role: 'EDITOR',
    },
  });

  const entrepreneurs = await Promise.all([
    prisma.entrepreneur.upsert({
      where: { slug: 'aleksey-smirnov' },
      update: {
        photo: placeholder(800, 800, '#DB2A00', 'АС'),
      },
      create: {
        slug: 'aleksey-smirnov',
        name: 'Алексей Смирнов',
        title: 'Основатель сети кофеен',
        photo: placeholder(800, 800, '#DB2A00', 'АС'),
        bio: 'Алексей основал сеть кофеен в 2018 году. Сегодня под его управлением 15 точек в трёх городах России.',
        quote: 'Главный — не тот, кто орет, а тот, кто решает.',
        isPublished: true,
      },
    }),
    prisma.entrepreneur.upsert({
      where: { slug: 'anna-belova' },
      update: {
        photo: placeholder(800, 800, '#DB2A00', 'АБ'),
      },
      create: {
        slug: 'anna-belova',
        name: 'Анна Белова',
        title: 'Основательница бренда косметики',
        photo: placeholder(800, 800, '#DB2A00', 'АБ'),
        bio: 'Анна вывела свой бренд натуральной косметики на маркетплейсы и за год достигла оборота в 100 млн рублей.',
        quote: 'Рынок не терпит посредственности. Либо лучший, либо никакой.',
        isPublished: true,
      },
    }),
    prisma.entrepreneur.upsert({
      where: { slug: 'dmitriy-volkov' },
      update: {
        photo: placeholder(800, 800, '#DB2A00', 'ДВ'),
      },
      create: {
        slug: 'dmitriy-volkov',
        name: 'Дмитрий Волков',
        title: 'CEO IT-компании',
        photo: placeholder(800, 800, '#DB2A00', 'ДВ'),
        bio: 'Дмитрий 10 лет развивает продуктовую IT-компанию с командой из 200 человек.',
        quote: 'Бизнес — это не про деньги. Это про людей и решения.',
        isPublished: true,
      },
    }),
  ]);

  await prisma.interview.upsert({
    where: { slug: 'aleksey-smirnov-kofeynya' },
    update: {
      coverImage: placeholder(1920, 1080, '#1a1a1a', 'Интервью'),
    },
    create: {
      slug: 'aleksey-smirnov-kofeynya',
      title: 'Как построить сеть кофеен, которая работает без вас',
      subtitle: 'Алексей Смирнов — о делегировании, команде и культуре решений',
      entrepreneurId: entrepreneurs[0].id,
      coverImage: placeholder(1920, 1080, '#1a1a1a', 'Интервью'),
      videoType: 'EMBED',
      videoUrl: 'https://rutube.ru/video/embed/123456',
      summary: 'Алексей рассказывает, как выстроить процессы так, чтобы бизнес не зависел от личного присутствия основателя.',
      content: '<p>Текст интервью будет здесь.</p>',
      quote: 'Главный — не тот, кто орет, а тот, кто решает.',
      isPublished: true,
      publishedAt: new Date('2026-06-10'),
      metaTitle: 'Алексей Смирнов: интервью о сети кофеен',
      metaDesc: 'Как построить сеть кофеен, которая работает без основателя.',
    },
  });

  await prisma.reel.upsert({
    where: { slug: 'anna-belova-marketplace' },
    update: {
      coverImage: placeholder(600, 1067, '#2a2a2a', 'Рилс'),
    },
    create: {
      slug: 'anna-belova-marketplace',
      title: 'Анна Белова: как вывести продукт на маркетплейс',
      entrepreneurId: entrepreneurs[1].id,
      coverImage: placeholder(600, 1067, '#2a2a2a', 'Рилс'),
      videoType: 'EMBED',
      videoUrl: 'https://rutube.ru/video/embed/654321',
      description: 'Короткий разбор стратегии выхода на маркетплейсы для нового бренда.',
      isPublished: true,
    },
  });

  const articleData = [
    {
      slug: 'kak-nayti-svoyu-nishu',
      title: 'Как найти свою нишу в 2026 году',
      subtitle: 'Пошаговая стратегия от действующих предпринимателей',
      entrepreneurId: entrepreneurs[2].id,
      coverImage: placeholder(1200, 675, '#333333', 'Блог'),
      content: '<p>Ниша — это пересечение вашей экспертизы, спроса и конкурентного преимущества.</p>',
      isPublished: true,
      publishedAt: new Date('2026-06-12'),
      metaTitle: 'Как найти свою нишу в 2026 году',
      metaDesc: 'Разбираем стратегии поиска и проверки ниши на реальных кейсах.',
    },
    {
      slug: 'kak-sobrat-komandu',
      title: 'Как собрать команду, когда бюджет ограничен',
      subtitle: 'Практические советы для стартапов',
      entrepreneurId: entrepreneurs[0].id,
      coverImage: placeholder(1200, 675, '#1a5276', 'Команда'),
      content: '<p>Команда — это главный ресурс. Как найти людей, которые горят делом?</p>',
      isPublished: true,
      publishedAt: new Date('2026-07-01'),
      metaTitle: 'Как собрать команду стартапа',
      metaDesc: 'Советы по найму и мотивации для предпринимателей с ограниченным бюджетом.',
    },
    {
      slug: 'mify-o-biznese',
      title: '5 мифов о бизнесе, в которые пора перестать верить',
      subtitle: 'Разбираем популярные заблуждения начинающих предпринимателей',
      entrepreneurId: entrepreneurs[1].id,
      coverImage: placeholder(1200, 675, '#922B21', 'Мифы'),
      content: '<p>Миф первый: для бизнеса нужен большой стартовый капитал. На самом деле — нужна идея и дисциплина.</p>',
      isPublished: true,
      publishedAt: new Date('2026-07-10'),
      metaTitle: 'Мифы о бизнесе',
      metaDesc: 'Разбираем самые распространённые заблуждения начинающих предпринимателей.',
    },
    {
      slug: 'kak-vyyti-na-marketpleys',
      title: 'Как вывести продукт на маркетплейс за 30 дней',
      subtitle: 'Пошаговый гайд от Анны Беловой',
      entrepreneurId: entrepreneurs[1].id,
      coverImage: placeholder(1200, 675, '#1E8449', 'Маркетплейс'),
      content: '<p>Маркетплейсы дают быстрый доступ к миллионам покупателей. Но как не утонуть в конкуренции?</p>',
      isPublished: true,
      publishedAt: new Date('2026-07-20'),
      metaTitle: 'Выход на маркетплейс',
      metaDesc: 'Гайд по выводу нового продукта на маркетплейсы.',
    },
    {
      slug: 'finansovaya-gramotnost',
      title: 'Финансовая грамотность для предпринимателя',
      subtitle: 'Как считать деньги и не разориться',
      entrepreneurId: entrepreneurs[2].id,
      coverImage: placeholder(1200, 675, '#B7950B', 'Финансы'),
      content: '<p>Умение считать деньги — базовый навык предпринимателя. Без него даже прибыльный бизнес может рухнуть.</p>',
      isPublished: true,
      publishedAt: new Date('2026-08-01'),
      metaTitle: 'Финансовая грамотность предпринимателя',
      metaDesc: 'Как управлять финансами бизнеса и личными финансами.',
    },
    {
      slug: 'mashtabirovanie-biznesa',
      title: 'Масштабирование: когда бизнес готов расти',
      subtitle: 'Признаки того, что пора выходить на новый уровень',
      entrepreneurId: entrepreneurs[0].id,
      coverImage: placeholder(1200, 675, '#6C3483', 'Рост'),
      content: '<p>Масштабирование — это не просто «делать больше». Это системная работа над процессами, командой и инфраструктурой.</p>',
      isPublished: true,
      publishedAt: new Date('2026-08-03'),
      metaTitle: 'Масштабирование бизнеса',
      metaDesc: 'Признаки готовности бизнеса к масштабированию.',
    },
  ];

  for (const a of articleData) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: { coverImage: a.coverImage },
      create: a,
    });
  }

  await prisma.business.upsert({
    where: { slug: 'coffee-room-15' },
    update: {
      coverImage: placeholder(1200, 675, '#4a3b2a', 'Бизнес'),
    },
    create: {
      slug: 'coffee-room-15',
      name: 'Coffee Room №15',
      type: 'Кофейня',
      description: '<p>Сеть кофеен, основанная Алексеем Смирновым в 2018 году. 15 точек в трёх городах России.</p>',
      city: 'Москва',
      address: 'ул. Большая Никитская, 15',
      phone: '+7 (495) 123-45-67',
      email: 'hello@coffeeroom15.ru',
      website: 'https://coffeeroom15.ru',
      coverImage: placeholder(1200, 675, '#4a3b2a', 'Бизнес'),
      entrepreneurId: entrepreneurs[0].id,
      isPublished: true,
    },
  });

  await Promise.all([
    prisma.siteSetting.upsert({ where: { key: 'SOCIAL_TELEGRAM' }, update: {}, create: { key: 'SOCIAL_TELEGRAM', value: 'https://t.me/guessboss' } }),
    prisma.siteSetting.upsert({ where: { key: 'SOCIAL_VK' }, update: {}, create: { key: 'SOCIAL_VK', value: 'https://vk.com/guessboss' } }),
    prisma.siteSetting.upsert({ where: { key: 'SOCIAL_YOUTUBE' }, update: {}, create: { key: 'SOCIAL_YOUTUBE', value: 'https://youtube.com/@guessboss' } }),
  ]);

  console.log('Seed completed');
  console.log('Admin: admin@guessboss.local / ' + adminPassword);
  console.log('Editor: editor@guessboss.local / ' + adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
