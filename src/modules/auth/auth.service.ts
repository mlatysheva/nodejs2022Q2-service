import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
    delete user.hash;
    return user;
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
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw error;
    }
  }
}
