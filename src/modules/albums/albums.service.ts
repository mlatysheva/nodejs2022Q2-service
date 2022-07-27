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
import { Album } from '@prisma/client';
import { TracksService } from '../tracks/tracks.service';
import { PrismaClient } from '@prisma/client';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

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
    // if (!uuIdValidateV4(id)) {
    //   throw new BadRequestException('Invalid UUID.');
    // }
    // const album = await this.prisma.album.findFirst({ where: { id } });
    // if (!album) {
    //   throw new NotFoundException(`Album with id ${id} not found`);
    // }
    // const compoundAlbum = Object.assign(album, updatedAlbumData);
    // if (updatedAlbumData.artistId) {
    //   const artist = await this.prisma.artist.findFirst({
    //     where: { id: updatedAlbumData.artistId },
    //   });
    //   if (!artist) {
    //     throw new NotFoundException(
    //       `Artist with id ${compoundAlbum.artistId} not found`,
    //     );
    //   }
    // }
    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: {
        ...updatedAlbumData,
      },
      // data: { ...updatedAlbumData },
    });
    return updatedAlbum;
  }

  async setArtistIdToNull(artistId: string): Promise<void> {
    const albums = await this.findAll();
    for (const album of albums) {
      if (album.artistId === artistId) {
        album.artistId = null;
        // this.update(artistId, album);
      }
    }
    // albums.forEach((album) => {
    //   if (album.artistId === artistId) {
    //     const updateAlbumDto = new UpdateAlbumDto();
    //     updateAlbumDto.artistId = null;
    //     this.update(artistId, updateAlbumDto);
    //   }
    // });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.tracksService.setAlbumIdToNull(id);
    await this.prisma.album.delete({ where: { id } });
  }
}
