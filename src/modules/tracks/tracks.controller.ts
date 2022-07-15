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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackModel } from './entities/track.entity';
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@Controller('track')
@ApiTags('track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService, // private readonly favouritesService: FavouritesService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Tracks retrieved successfully.' })
  public findAll(): Array<TrackModel> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Track retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Track not found.' })
  @ApiBadRequestResponse({ description: 'Invalid UUID.' })
  @ApiNoContentResponse({ description: 'Track entry is empty.' })
  public findOne(@Param('id') id: string): TrackModel {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const track = this.tracksService.findOne(id);
    if (!track) {
      throw new HttpException('Track not found.', HttpStatus.NOT_FOUND);
    }
    if (Object(track).id === undefined) {
      throw new HttpException('Track entry is empty.', HttpStatus.NO_CONTENT);
    }
    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Track created successfully.' })
  @ApiUnprocessableEntityResponse({
    description: 'Track name already exists.',
  })
  public create(
    @Body(new ValidationPipe()) createdTrack: CreateTrackDto,
  ): TrackModel {
    return this.tracksService.create(createdTrack);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Track updated successfully.' })
  @ApiNotFoundResponse({ description: 'Track not found.' })
  @ApiUnprocessableEntityResponse({
    description: 'Track name already exists.',
  })
  public update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe()) updatedTrack: UpdateTrackDto,
  ) {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const track = this.tracksService.findOne(id);
    if (!track) {
      throw new HttpException('Track not found.', HttpStatus.NOT_FOUND);
    }
    return this.tracksService.update(id, updatedTrack);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOkResponse({ description: 'Track deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Track not found.' })
  public delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): void {
    if (!uuIdValidateV4(id)) {
      throw new HttpException('Invalid UUID.', HttpStatus.BAD_REQUEST);
    }
    const track = this.tracksService.findOne(id);
    if (!track) {
      throw new HttpException('Track not found.', HttpStatus.NOT_FOUND);
    }
    // this.favouritesService.deleteFavoriteTrack(id);
    this.tracksService.delete(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  setArtistIdToNull(@Param() id) {
    this.tracksService.setArtistIdToNull(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  setAlbumIdToNull(@Param() id) {
    this.tracksService.setAlbumIdToNull(id);
  }
}
