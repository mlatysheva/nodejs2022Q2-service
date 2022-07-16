import { IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackModel {
  @ApiProperty({ type: String })
  id?: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  artistId: string | null;

  @ApiPropertyOptional({ type: String })
  @IsString()
  albumId: string | null;

  @ApiProperty({ type: Number })
  @IsNumber()
  duration: number;
}
