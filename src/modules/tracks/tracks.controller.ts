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
import { FavoritesService } from '../favorites/favorites.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackModel } from './entities/track.entity';

@Controller('track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public findAll(): Array<TrackModel> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
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
  public create(
    @Body(new ValidationPipe()) createdTrack: CreateTrackDto,
  ): TrackModel {
    return this.tracksService.create(createdTrack);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
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
    this.tracksService.delete(id);
  }
}
