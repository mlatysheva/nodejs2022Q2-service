import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AlbumModel {
  @ApiProperty({ type: String })
  id?: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  year: number;

  @ApiPropertyOptional({ type: String })
  artistId: string | null;
}
