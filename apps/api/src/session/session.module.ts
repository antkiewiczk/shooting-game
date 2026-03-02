import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '../../prisma/prisma.module';
import { SessionController, LeaderboardController } from './session.controller';
import { LeaderboardSseController } from './leaderboard-sse.controller';
import { SessionService } from './session.service';
import { SessionRepository, EventRepository } from './repositories';

@Module({
  imports: [EventEmitterModule.forRoot(), PrismaModule],
  controllers: [
    SessionController,
    LeaderboardController,
    LeaderboardSseController,
  ],
  providers: [SessionService, SessionRepository, EventRepository],
  exports: [SessionRepository, EventRepository],
})
export class SessionModule {}
