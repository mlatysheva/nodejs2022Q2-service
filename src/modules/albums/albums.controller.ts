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
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiTags } from '@nestjs/swagger';
import { AlbumModel } from './entities/album.entity';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@Controller('album')
@ApiTags('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Albums retrieved successfully.' })
  public findAll(): Array<AlbumModel> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Album retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Album not found.' })
  @ApiBadRequestResponse({ description: 'Invalid UUID.' })
  @ApiNoContentResponse({ description: 'Album entry is empty.' })
  public findOne(@Param('id') id: string): AlbumModel {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const Album = this.albumsService.findOne(id);
    if (!Album) {
      throw new HttpException('Album not found.', HttpStatus.NOT_FOUND);
    }
    if (Object(Album).id === undefined) {
      throw new HttpException('Album entry is empty.', HttpStatus.NO_CONTENT);
    }
    return Album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Album created successfully.' })
  @ApiUnprocessableEntityResponse({
    description: 'Album name already exists.',
  })
  public create(
    @Body(new ValidationPipe()) createdAlbum: CreateAlbumDto,
  ): AlbumModel {
    return this.albumsService.create(createdAlbum);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Album updated successfully.' })
  @ApiNotFoundResponse({ description: 'Album not found.' })
  @ApiUnprocessableEntityResponse({
    description: 'Album name already exists.',
  })
  public update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updatedAlbum: UpdateAlbumDto,
  ) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const Album = this.albumsService.findOne(id);
    if (!Album) {
      throw new HttpException('Album not found.', HttpStatus.NOT_FOUND);
    }
    return this.albumsService.update(id, updatedAlbum);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOkResponse({ description: 'Album deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Album not found.' })
  public delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): void {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const album = this.albumsService.findOne(id);
    if (!album) {
      throw new HttpException('Album not found.', HttpStatus.NOT_FOUND);
    }
    // this.favouritesService.deleteFavoriteAlbum(id);
    this.albumsService.delete(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  setArtistIdToNull(@Param() id) {
    this.albumsService.setArtistIdToNull(id);
  }
}
