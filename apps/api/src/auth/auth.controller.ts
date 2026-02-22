import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

class GenerateTokenDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('token')
  @HttpCode(HttpStatus.OK)
  async generateToken(@Body() dto: GenerateTokenDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { email: dto.email },
      });
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { token };
  }
}
