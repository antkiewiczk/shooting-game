import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = ['player1@test.com', 'player2@test.com', 'player3@test.com'];

  for (const email of users) {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    console.log(`Created/found user: ${user.email} (${user.id})`);
  }

  console.log(`\nSeeded ${users.length} users`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
