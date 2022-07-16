import {
  Inject,
  Injectable,
  Logger,
  forwardRef,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
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
  ) {}

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
      return this.favorites.tracks.push(trackId);
    }
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
      return this.favorites.albums.push(albumId);
    }
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
      return this.favorites.artists.push(artistId);
    }
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
    try {
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
    } catch {
      throw new BadRequestException('No favorites found');
    }
  }

  deleteTrackFromFavorites(trackId: string) {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index === -1) {
      throw new BadRequestException(`Artist ${trackId} not found.`);
    } else {
      this.favorites.tracks = this.favorites.tracks.filter((track) => {
        track !== trackId;
      });
    }
  }

  deleteAlbumFromFavorites(albumId: string) {
    const index = this.favorites.albums.indexOf(albumId);
    if (index === -1) {
      throw new BadRequestException(`Artist ${albumId} not found.`);
    } else {
      this.favorites.albums = this.favorites.albums.filter((album) => {
        album !== albumId;
      });
    }
  }

  deleteArtistFromFavorites(artistId: string) {
    const index = this.favorites.artists.indexOf(artistId);
    if (index === -1) {
      throw new BadRequestException(`Artist ${artistId} not found.`);
    } else {
      this.favorites.artists = this.favorites.artists.filter((artist) => {
        artist !== artistId;
      });
    }
  }
}
