import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function requireAdminSeedPassword(): string {
  const value = process.env.ADMIN_SEED_PASSWORD?.trim();
  if (!value || value.length < 12) {
    throw new Error('ADMIN_SEED_PASSWORD must contain at least 12 characters');
  }
  return value;
}

const adminPassword = requireAdminSeedPassword();

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
  console.log('Admin: admin@guessboss.local');
  console.log('Editor: editor@guessboss.local');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
