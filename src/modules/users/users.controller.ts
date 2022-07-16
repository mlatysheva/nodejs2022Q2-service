import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() createdUser: CreateUserDto): UserModel {
    return this.usersService.create(createdUser);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatedUser: UpdateUserDto,
  ) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    if (updatedUser.oldPassword !== user.password)
      throw new ForbiddenException({
        statusCode: 403,
        message: 'The passwords entered do not match.',
        error: 'Forbidden',
      });
    return this.usersService.update(id, updatedUser);
  }

  @Delete(':id')
  @HttpCode(204)
  public delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): void {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    this.usersService.delete(id);
  }
}
