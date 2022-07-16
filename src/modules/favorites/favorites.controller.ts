import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

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
    return this.favoritesService.addTrackToFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.addAlbumToFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrackFromFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.deleteTrackFromFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbumFromFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.deleteAlbumFromFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtistFromFavorites(@Param('id') id: string) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    return this.favoritesService.deleteArtistFromFavorites(id);
  }
}
