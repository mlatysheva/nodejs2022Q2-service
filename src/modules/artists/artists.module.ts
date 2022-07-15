import { Module, forwardRef } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  controllers: [ArtistsController],
  imports: [
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
    // forwardRef(() => FavouritesModule)
  ],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
