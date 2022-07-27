import {
  Inject,
  Injectable,
  Logger,
  forwardRef,
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesModel } from './entities/favorite.entity';
import { FavoritesResponse } from './entities/favoriteResponse.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {}

  prisma = new PrismaClient();

  async addTrackToFavorites(trackId: string) {
    if (!uuIdValidateV4(trackId)) {
      throw new BadRequestException('Invalid track id');
    }
    const track = await this.tracksService.findOne(trackId);
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }
    const favorites = await this.prisma.favorite.findMany();
    if (favorites.length > 0) {
      await this.prisma.track.update({
        where: { id: trackId },
        data: { favoriteId: favorites[0].id },
      });
    } else {
      const newFavorite = await this.prisma.favorite.create({
        data: {},
      });
      await this.prisma.track.update({
        where: { id: trackId },
        data: { favoriteId: newFavorite.id },
      });
    }
    return;
  }

  async addAlbumToFavorites(albumId: string) {
    if (!uuIdValidateV4(albumId)) {
      throw new BadRequestException('Invalid album id');
    }
    const album = this.albumsService.findOne(albumId);
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }
    const favorites = await this.prisma.favorite.findMany();
    if (favorites.length > 0) {
      await this.prisma.album.update({
        where: { id: albumId },
        data: { favoriteId: favorites[0].id },
      });
    } else {
      const newFavorite = await this.prisma.favorite.create({
        data: {},
      });
      await this.prisma.album.update({
        where: { id: albumId },
        data: { favoriteId: newFavorite.id },
      });
    }
    return;
  }

  async addArtistToFavorites(artistId: string) {
    if (!uuIdValidateV4(artistId)) {
      throw new BadRequestException('Invalid artist id');
    }
    const artist = await this.artistsService.findOne(artistId);
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    const favorites = await this.prisma.favorite.findMany();
    if (favorites.length > 0) {
      await this.prisma.artist.update({
        where: { id: artistId },
        data: { favoriteId: favorites[0].id },
      });
    } else {
      const newFavorite = await this.prisma.favorite.create({
        data: {},
      });
      await this.prisma.artist.update({
        where: { id: artistId },
        data: { favoriteId: newFavorite.id },
      });
    }
    return;
  }

  async findAll() {
    const favorites = await this.prisma.favorite.findMany({
      select: {
        albums: {
          select: {
            id: true,
            name: true,
            year: true,
            artistId: true,
          },
        },
        artists: {
          select: {
            id: true,
            name: true,
            grammy: true,
          },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            albumId: true,
            artistId: true,
          },
        },
      },
    });

    const favoritesArray = favorites[0];
    const artists =
      favorites.length > 0 && favoritesArray.artists
        ? favoritesArray.artists
        : [];
    const albums =
      favorites.length > 0 && favoritesArray.albums
        ? favoritesArray.albums
        : [];
    const tracks =
      favorites.length > 0 && favoritesArray.tracks
        ? favoritesArray.tracks
        : [];

    return { artists, albums, tracks };
  }

  async deleteTrackFromFavorites(trackId: string) {
    if (!uuIdValidateV4(trackId)) {
      throw new BadRequestException('Invalid track id');
    }
    const track = await this.prisma.track.findFirst({ where: { id: trackId } });
    if (!track) {
      throw new NotFoundException(`Track with id ${trackId} not found.`);
    }
    if (track.favoriteId) {
      await this.prisma.track.update({
        where: { id: trackId },
        data: { favoriteId: null },
      });
    }
    return;
  }

  async deleteAlbumFromFavorites(albumId: string) {
    if (!uuIdValidateV4(albumId)) {
      throw new BadRequestException('Invalid album id');
    }
    const album = await this.albumsService.findOne(albumId);
    if (!album) {
      throw new NotFoundException(`Album with id ${albumId} not found.`);
    }
    if (album.favoriteId) {
      await this.prisma.album.update({
        where: { id: albumId },
        data: { favoriteId: null },
      });
    }
    return;
  }

  async deleteArtistFromFavorites(artistId: string) {
    if (!uuIdValidateV4(artistId)) {
      throw new BadRequestException('Invalid artist id');
    }
    const artist = await this.prisma.artist.findFirst({
      where: { id: artistId },
    });
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${artistId} not found.`,
      );
    }
    if (artist.favoriteId) {
      await this.prisma.artist.update({
        where: { id: artistId },
        data: { favoriteId: null },
      });
    }
    // return;
  }
}
