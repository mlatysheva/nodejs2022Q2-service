import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid } from 'uuid';
import { Album } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';

@Injectable()
export class AlbumsService {
  prisma = new PrismaClient();

  async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const album: Album = await this.prisma.album.findFirst({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  async create(albumData: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = await this.prisma.album.create({
      data: {
        id: uuid(),
        ...albumData,
      },
    });
    return newAlbum;
  }

  async update(id: string, updatedAlbumData: UpdateAlbumDto) {
    await this.findOne(id);
    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: {
        ...updatedAlbumData,
      },
    });
    return updatedAlbum;
  }

  async delete(id: string): Promise<void> {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException(`Invalid UUID.`);
    }
    const album = await this.prisma.album.findFirst({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    await this.prisma.album.delete({ where: { id } });
  }
}
