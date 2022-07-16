import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  HttpException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    if (!this.tracksService.findOne(id)) {
      throw new UnprocessableEntityException('Track not found.');
    }
    return this.favoritesService.addTrackToFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    if (!this.albumsService.findOne(id)) {
      throw new UnprocessableEntityException('Album not found.');
    }
    return this.favoritesService.addAlbumToFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    if (!this.artistsService.findOne(id)) {
      throw new UnprocessableEntityException('Artist not found.');
    }
    return this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrackFromFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    if (!this.tracksService.findOne(id)) {
      throw new UnprocessableEntityException('Track not found.');
    }
    return this.favoritesService.deleteTrackFromFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbumFromFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    if (!this.albumsService.findOne(id)) {
      throw new UnprocessableEntityException('Album not found.');
    }
    return this.favoritesService.deleteAlbumFromFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtistFromFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    if (!this.artistsService.findOne(id)) {
      throw new UnprocessableEntityException('Artist not found.');
    }
    return this.favoritesService.deleteArtistFromFavorites(id);
  }
}
