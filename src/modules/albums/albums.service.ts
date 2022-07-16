import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid } from 'uuid';
import { AlbumModel } from './entities/album.entity';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class AlbumsService {
  @Inject(forwardRef(() => TracksService))
  private tracksService: TracksService;
  private albums: Array<AlbumModel> = [];
  private logger = new Logger(AlbumsService.name);

  public findAll(): Array<AlbumModel> {
    this.logger.log('Getting all albums');
    return this.albums;
  }

  public findOne(id: string): AlbumModel {
    const album: AlbumModel = this.albums.find((album) => album.id === id);
    this.logger.log('Getting the album by id');
    return album;
  }

  public create(album: CreateAlbumDto): AlbumModel {
    const newAlbum: AlbumModel = {
      ...album,
      id: uuid(),
    };
    this.albums.push(newAlbum);
    this.logger.log('Creating an album');
    return newAlbum;
  }

  public update(id: string, updatedAlbum: UpdateAlbumDto): AlbumModel {
    const album: AlbumModel = this.albums.find((album) => album.id === id);
    const index: number = this.albums.indexOf(album);
    this.albums[index] = {
      ...album,
      ...updatedAlbum,
    };
    this.logger.log('Updating the album');
    return this.albums[index];
  }

  public setArtistIdToNull(artistId: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }

  public delete(id: string): void {
    const index: number = this.albums.findIndex((album) => album.id === id);
    this.logger.log('Deleting the album');
    this.tracksService.setAlbumIdToNull(id);
    this.albums.splice(index, 1);
  }
}
