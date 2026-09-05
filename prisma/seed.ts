import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // Create an initial admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@converthub.com' },
    update: {},
    create: {
      email: 'admin@converthub.com',
      name: 'Super Admin',
      auth_provider: 'email',
      password_hash: 'hashed_password_placeholder',
    },
  });

  console.log(`Created admin user: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
