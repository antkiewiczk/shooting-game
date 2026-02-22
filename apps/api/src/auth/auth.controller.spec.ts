/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };

    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    jwtService = app.get<JwtService>(JwtService);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('generateToken', () => {
    it('should return a token for existing user', async () => {
      const existingUser = { id: 'user-1', email: 'test@test.com' };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
        existingUser,
      );

      const result = await controller.generateToken({ email: 'test@test.com' });

      expect(result).toEqual({ token: 'mock-token' });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'test@test.com',
      });
    });

    it('should create and return token for new user', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue({
        id: 'new-user',
        email: 'new@test.com',
      });

      const result = await controller.generateToken({ email: 'new@test.com' });

      expect(result).toEqual({ token: 'mock-token' });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { email: 'new@test.com' },
      });
    });
  });
});
