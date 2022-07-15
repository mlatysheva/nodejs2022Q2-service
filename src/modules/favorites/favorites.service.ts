import {
  Inject,
  Injectable,
  Logger,
  forwardRef,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { FavoritesModel } from './entities/favorite.entity';
import { FavoritesResponse } from './entities/favoriteResponse.entity';

@Injectable()
export class FavoritesService {
  private favorites: FavoritesModel = {
    artists: [],
    albums: [],
    tracks: [],
  };
  private logger = new Logger(FavoritesService.name);

  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {
    this.favorites = {
      artists: [],
      albums: [],
      tracks: [],
    };
  }

  public addTrackToFavorites(trackId: string) {
    try {
      this.tracksService.findOne(trackId);
    } catch {
      throw new UnprocessableEntityException('Track not found');
    }
    const doesExist = this.favorites.tracks.includes(trackId);
    if (doesExist) {
      throw new UnprocessableEntityException(
        'Track already exists in favorites',
      );
    } else {
      this.favorites.tracks.push(trackId);
    }
    return trackId;
  }

  public addAlbumToFavorites(albumId: string) {
    try {
      this.albumsService.findOne(albumId);
    } catch {
      throw new UnprocessableEntityException('Album not found');
    }
    const doesExist = this.favorites.albums.includes(albumId);
    if (doesExist) {
      throw new UnprocessableEntityException(
        'Album already exists in favorites',
      );
    } else {
      this.favorites.albums.push(albumId);
    }
    return albumId;
  }

  public addArtistToFavorites(artistId: string) {
    try {
      this.artistsService.findOne(artistId);
    } catch {
      throw new UnprocessableEntityException('Artist not found');
    }
    const doesExist = this.favorites.artists.includes(artistId);
    if (doesExist) {
      throw new UnprocessableEntityException(
        'Artist already exists in favorites',
      );
    } else {
      this.favorites.artists.push(artistId);
    }
    return artistId;
  }

  findAll() {
    const favoritesResponse: FavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };
    const tracks = this.favorites.tracks;
    const albums = this.favorites.albums;
    const artists = this.favorites.artists;
    for (const track of tracks) {
      favoritesResponse.tracks.push(this.tracksService.findOne(track));
    }
    for (const album of albums) {
      favoritesResponse.albums.push(this.albumsService.findOne(album));
    }
    for (const artist of artists) {
      favoritesResponse.artists.push(this.artistsService.findOne(artist));
    }
    return favoritesResponse;
  }

  deleteTrackFromFavorites(trackId: string) {
    const doesExist = this.favorites.tracks.includes(trackId);
    if (!doesExist) {
      throw new UnprocessableEntityException('Track not found');
    }
    const index = this.favorites.tracks.indexOf(trackId);
    this.favorites.tracks.splice(index, 1);
    return trackId;
  }

  deleteAlbumFromFavorites(albumId: string) {
    const doesExist = this.favorites.albums.includes(albumId);
    if (!doesExist) {
      throw new UnprocessableEntityException('Album not found');
    }
    const index = this.favorites.albums.indexOf(albumId);
    this.favorites.albums.splice(index, 1);
    return albumId;
  }

  deleteArtistFromFavorites(artistId: string) {
    const doesExist = this.favorites.artists.includes(artistId);
    if (!doesExist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    const index = this.favorites.artists.indexOf(artistId);
    this.favorites.artists.splice(index, 1);
    return artistId;
  }
}
