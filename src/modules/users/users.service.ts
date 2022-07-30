import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  prisma = new PrismaClient();

  convertToUser(user: User) {
    const { createdAt, updatedAt } = user;
    const createdAtToInt = createdAt.getTime();
    let updatedAtToInt = updatedAt.getTime();
    if (updatedAtToInt - createdAtToInt < 3) {
      updatedAtToInt = createdAtToInt;
    }
    delete user.hash;
    return {
      ...user,
      createdAt: createdAtToInt,
      updatedAt: updatedAtToInt,
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    const formattedUsers = [];
    for (const user of users) {
      formattedUsers.push(this.convertToUser(user));
    }
    return formattedUsers;
  }

  async findOne(id: string) {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.convertToUser(user);
  }

  async create(user: CreateUserDto) {
    const hash = await argon.hash(user.password);
    const newUser = await this.prisma.user.create({
      data: {
        login: user.login,
        version: 1,
        hash: hash,
      },
    });

    return this.convertToUser(newUser);
  }

  async update(id: string, updatedUserData: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { oldPassword, newPassword } = updatedUserData;
    const passwordValid = await argon.verify(user.hash, oldPassword);
    if (!passwordValid) {
      throw new ForbiddenException('Incorrect password');
    }
    const hash = await argon.hash(newPassword);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        version: user.version + 1,
        updatedAt: new Date(),
        hash: hash,
      },
    });
    return this.convertToUser(updatedUser);
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
  }
}
