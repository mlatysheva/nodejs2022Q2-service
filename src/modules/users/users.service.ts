import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './entities/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  private users: Array<UserModel> = [];
  private logger = new Logger(UsersService.name);

  public findAll(): Array<UserModel> {
    this.logger.log('Getting all users');
    return this.users;
  }

  public findOne(id: string): UserModel {
    const user: UserModel = this.users.find((user) => user.id === id);
    this.logger.log(`Getting the user by id ${id}`);
    return user;
  }

  public create(user: CreateUserDto): UserModel {
    const newUser = new UserModel({
      ...user,
      id: uuid(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    this.users.push(newUser);
    this.logger.log(`User with id ${newUser.id} created`);
    return newUser;
  }

  public update(id: string, updatedUser: UpdateUserDto): UserModel {
    const user: UserModel = this.users.find((user) => user.id === id);
    const index: number = this.users.indexOf(user);
    this.users[index] = new UserModel({
      ...user,
      password: updatedUser.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });
    this.logger.log(`Updating the user with id ${id}`);
    return this.users[index];
  }

  public delete(id: string): void {
    const index: number = this.users.findIndex((User) => User.id === id);
    this.logger.log(`Deleting the user with id ${id}`);
    this.users.splice(index, 1);
  }
}
