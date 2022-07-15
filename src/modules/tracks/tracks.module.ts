import { Module, forwardRef } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { AlbumsModule } from '../albums/albums.module';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  controllers: [TracksController],
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    // forwardRef(() => FavouritesModule)
  ],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
