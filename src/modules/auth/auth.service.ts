import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    const passwordValid = await argon.verify(user.hash, dto.password);
    if (!passwordValid) {
      throw new ForbiddenException('Incorrect password');
    }
    // delete user.hash;
    return this.createToken(user.login, user.id);
  }
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    console.log(`hash: ${hash}`);

    try {
      const user = await this.prisma.user.create({
        data: {
          login: dto.login,
          hash: hash,
        },
      });
      // delete user.hash;
      return this.createToken(user.login, user.id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw error;
    }
  }

  async createToken(login: string, userId: string) {
    const payload = { login: login, sub: userId };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });
    return { accessToke: token };
  }
}
