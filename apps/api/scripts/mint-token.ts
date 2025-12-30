import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const jwt = new JwtService({ secret: process.env.JWT_SECRET });

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const email = args[0];
  if (!email) throw new Error('email required');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('user not found');

  const token = jwt.sign({ sub: user.id, email: user.email });
  console.log(token);
}

main();
