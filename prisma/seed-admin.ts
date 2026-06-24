import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'admin123';

async function main() {
  const password = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: 'admin@guessboss.local' },
    update: {},
    create: {
      email: 'admin@guessboss.local',
      password,
      name: 'Администратор',
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'editor@guessboss.local' },
    update: {},
    create: {
      email: 'editor@guessboss.local',
      password,
      name: 'Редактор',
      role: Role.EDITOR,
    },
  });

  console.log('Admin seed completed');
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
