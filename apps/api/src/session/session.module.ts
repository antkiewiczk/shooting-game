import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SessionController, LeaderboardController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [PrismaModule],
  controllers: [SessionController, LeaderboardController],
  providers: [SessionService],
})
export class SessionModule {}
