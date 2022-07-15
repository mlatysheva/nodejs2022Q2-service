import { Module, forwardRef } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TracksModule } from '../tracks/tracks.module';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  controllers: [AlbumsController],
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistsModule),
    // forwardRef(() => FavouritesModule)
  ],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
