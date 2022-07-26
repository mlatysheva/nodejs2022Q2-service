import {
  Injectable,
  Logger,
  Inject,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid } from 'uuid';
import { AlbumModel } from './entities/album.entity';
import { Album } from '@prisma/client';
import { TracksService } from '../tracks/tracks.service';
import { PrismaClient } from '@prisma/client';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';

@Injectable()
export class AlbumsService {
  @Inject(forwardRef(() => TracksService))
  private tracksService: TracksService;
  prisma = new PrismaClient();

  private albums: Array<AlbumModel> = [];
  private logger = new Logger(AlbumsService.name);

  findAll = async () => {
    this.logger.log('Getting all albums');
    return await this.prisma.album.findMany();
  };

  findOne = async (id: string) => {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const album = await this.prisma.album.findFirst({ where: { id } });
    this.logger.log('Getting the album by id');
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  };

  create = async (album: CreateAlbumDto) => {
    const newAlbum = {
      ...album,
      id: uuid(),
    };
    return await this.prisma.album.create({
      data: newAlbum,
    });
  };

  update = async (id: string, updatedAlbum: UpdateAlbumDto) => {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const album = this.prisma.album.findFirst({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return await this.prisma.album.update({
      where: { id },
      data: updatedAlbum,
    });
  };

  setArtistIdToNull = async (artistId: string) => {
    const albums = await this.prisma.album.findMany({ where: { artistId } });
    for (const album of albums) {
      album.artistId = null;
    }
  };

  delete = async (id: string) => {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const album = this.prisma.album.findFirst({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return await this.prisma.album.delete({ where: { id } });
  };
}
