import { Injectable, Logger } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuid } from 'uuid';
import { ArtistModel } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  private artists: Array<ArtistModel> = [];
  private logger = new Logger(ArtistsService.name);

  public findAll(): Array<ArtistModel> {
    this.logger.log('Getting all artists');
    return this.artists;
  }

  public findOne(id: string): ArtistModel {
    const artist: ArtistModel = this.artists.find((artist) => artist.id === id);
    this.logger.log('Getting the artist by id');
    return artist;
  }

  public create(artist: CreateArtistDto): ArtistModel {
    const newArtist: ArtistModel = {
      ...artist,
      id: uuid(),
    };

    this.artists.push(newArtist);
    this.logger.log('Creating an artist');
    return newArtist;
  }

  public update(id: string, updatedArtist: UpdateArtistDto): ArtistModel {
    const artist: ArtistModel = this.artists.find((artist) => artist.id === id);
    const index: number = this.artists.indexOf(artist);
    this.artists[index] = {
      ...artist,
      ...updatedArtist,
    };
    this.logger.log('Updating the artist');
    // this.artists[index] = Object.assign(artist, updatedArtist);
    // this.artists[index] = {
    //   id,
    //   name: updatedArtist.name || this.artists[index].name,
    //   grammy: updatedArtist.grammy || this.artists[index].grammy,
    // };
    return this.artists[index];
  }

  public delete(id: string): void {
    const index: number = this.artists.findIndex((artist) => artist.id === id);
    this.logger.log('Deleting the artist');
    this.artists.splice(index, 1);
  }
}
