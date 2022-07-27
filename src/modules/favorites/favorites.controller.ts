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
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrackToFavorites(@Param('id') id: string) {
    return await this.favoritesService.addTrackToFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbumToFavorites(@Param('id') id: string) {
    return await this.favoritesService.addAlbumToFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtistToFavorites(@Param('id') id: string) {
    return await this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async deleteTrackFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.deleteTrackFromFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbumFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.deleteAlbumFromFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteArtistFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.deleteArtistFromFavorites(id);
  }
}
