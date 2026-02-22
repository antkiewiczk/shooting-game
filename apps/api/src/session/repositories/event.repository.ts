import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IEventRepository,
  Event,
  CreateEventDto,
} from './session.repository.interface';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
    }) as Promise<Event | null>;
  }

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany();
  }

  async create(data: CreateEventDto): Promise<Event> {
    return this.prisma.event.create({
      data,
    }) as Promise<Event>;
  }

  async update(): Promise<Event> {
    // Events are immutable - updates not allowed
    return await Promise.reject(new Error('Method not implemented for events'));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({ where: { id } });
  }

  async findBySessionId(sessionId: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { sessionId },
      orderBy: { ts: 'asc' },
    });
  }
}
