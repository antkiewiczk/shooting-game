import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SessionController, LeaderboardController } from './session.controller';
import { SessionService } from './session.service';
import { SessionRepository, EventRepository } from './repositories';

@Module({
  imports: [PrismaModule],
  controllers: [SessionController, LeaderboardController],
  providers: [SessionService, SessionRepository, EventRepository],
  exports: [SessionRepository, EventRepository],
})
export class SessionModule {}
