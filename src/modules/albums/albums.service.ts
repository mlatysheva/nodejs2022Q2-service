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
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumsService {
  @Inject(forwardRef(() => TracksService))
  private tracksService: TracksService;
  @Inject(forwardRef(() => FavoritesService))
  private favoritesService: FavoritesService;
  prisma = new PrismaClient();

  private logger = new Logger(AlbumsService.name);

  async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const album: Album = await this.prisma.album.findUnique({
      where: { id: id },
    });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  async create(album: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = await this.prisma.album.create({
      data: {
        id: uuid(),
        ...album,
      },
    });
    return newAlbum;
  }

  async update(id: string, updatedAlbum: UpdateAlbumDto): Promise<Album> {
    await this.findOne(id);
    const updatedAlbumEntity: Album = await this.prisma.album.update({
      where: { id: id },
      data: { ...updatedAlbum },
    });
    return updatedAlbumEntity;
  }

  async setArtistIdToNull(artistId: string): Promise<void> {
    const albums = await this.findAll();
    for (const album of albums) {
      if (album.artistId === artistId) {
        album.artistId = null;
        this.update(album.id, album);
      }
    }
  }

  async delete(id: string): Promise<void> {
    if (!uuIdValidateV4(id)) {
      throw new NotFoundException('Invalid UUID.');
    }
    await this.findOne(id);
    await this.prisma.album.delete({ where: { id } });
  }
}
