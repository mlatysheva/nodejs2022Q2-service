import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuid } from 'uuid';
import { TrackModel } from './entities/track.entity';
import { Track } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  prisma = new PrismaClient();
  private logger = new Logger(TracksService.name);

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const track = await this.prisma.track.findFirst({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async create(trackData: CreateTrackDto) {
    const newTrack: Track = await this.prisma.track.create({
      data: {
        ...trackData,
      },
    });
    return newTrack;
  }

  async update(id: string, updatedTrackData: UpdateTrackDto) {
    await this.findOne(id);
    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: {
        ...updatedTrackData,
      },
    });
    return updatedTrack;
  }

  async delete(id: string) {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException(`Invalid UUID.`);
    }
    const track = await this.prisma.track.findFirst({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    // await this.favoritesService.deleteTrackFromFavorites(id);
    await this.prisma.track.delete({ where: { id } });
  }

  async setArtistIdToNull(artistId: string): Promise<void> {
    const tracks = await this.findAll();
    for (const track of tracks) {
      if (track.artistId === artistId) {
        track.artistId = null;
        // this.update(artistId, track);
      }
    }
  }

  async setAlbumIdToNull(albumId: string) {
    const tracks = await this.findAll();
    for (const track of tracks) {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    }
  }
}
