import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './create-track.dto';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  artistId: string | null;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  albumId: string | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  duration: number;
}
