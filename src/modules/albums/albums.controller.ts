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
  ValidationPipe,
  Inject,
  forwardRef,
  Res,
} from '@nestjs/common';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiTags } from '@nestjs/swagger';
import { AlbumModel } from './entities/album.entity';
import { Response } from 'express';

@Controller('album')
@ApiTags('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.albumsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ValidationPipe()) createdAlbum: CreateAlbumDto) {
    return await this.albumsService.create(createdAlbum);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatedAlbum: UpdateAlbumDto,
    @Res() response: Response,
  ) {
    console.log(`in controller id is ${id}`);
    console.log(`in controller updated album data`);
    console.dir(updatedAlbum);
    const updatedAlbumResponse = await this.albumsService.update(
      id,
      updatedAlbum,
    );
    console.log(`updated album response`);
    console.dir(updatedAlbumResponse);
    console.dir(response.json);
    return updatedAlbumResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.albumsService.delete(id);
  }
}
