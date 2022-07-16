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
} from '@nestjs/common';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';
import { ArtistsService } from './artists.service';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { FavoritesService } from '../favorites/favorites.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ApiTags } from '@nestjs/swagger';
import { ArtistModel } from './entities/artist.entity';

@Controller('artist')
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public findAll(): Array<ArtistModel> {
    return this.artistsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public findOne(@Param('id') id: string): ArtistModel {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const artist = this.artistsService.findOne(id);
    if (!artist) {
      throw new HttpException('Artist not found.', HttpStatus.NOT_FOUND);
    }
    if (Object(artist).id === undefined) {
      throw new HttpException('Artist entry is empty.', HttpStatus.NO_CONTENT);
    }
    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() createdArtist: CreateArtistDto): ArtistModel {
    return this.artistsService.create(createdArtist);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updatedArtist: UpdateArtistDto,
  ) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const artist = this.artistsService.findOne(id);
    if (!artist) {
      throw new HttpException('Artist not found.', HttpStatus.NOT_FOUND);
    }
    return this.artistsService.update(id, updatedArtist);
  }

  @Delete(':id')
  @HttpCode(204)
  public delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): void {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const artist = this.artistsService.findOne(id);
    if (!artist) {
      throw new HttpException('Artist not found.', HttpStatus.NOT_FOUND);
    }
    this.tracksService.setArtistIdToNull(id);
    this.albumsService.setArtistIdToNull(id);
    this.artistsService.delete(id);
  }
}
