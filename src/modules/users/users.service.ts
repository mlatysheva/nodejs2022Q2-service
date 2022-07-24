import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  prisma = new PrismaClient();

  convertToUser(user: User) {
    const { createdAt, updatedAt } = user;
    delete user.password;
    return {
      ...user,
      createdAt: createdAt.getTime(),
      updatedAt: updatedAt.getTime(),
    };
  }

  findAll = async () => {
    const users = await this.prisma.user.findMany();
    const formattedUsers = [];
    for (const user of users) {
      formattedUsers.push(this.convertToUser(user));
    }
    return formattedUsers;
  };

  findOne = async (id: string) => {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.convertToUser(user);
  };

  create = async (user: CreateUserDto) => {
    const newUser = await this.prisma.user.create({
      data: {
        login: user.login,
        password: user.password,
        version: 1,
      },
    });

    return this.convertToUser(newUser);
  };

  update = async (id: string, updatedUserData: UpdateUserDto) => {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { oldPassword, newPassword } = updatedUserData;
    if (oldPassword !== user.password) {
      throw new ForbiddenException(`Incorrect password given`);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updatedUserData,
        password: newPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });
    return this.convertToUser(updatedUser);
  };

  delete = async (id: string) => {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.prisma.user.delete({ where: { id } });
  };
}
