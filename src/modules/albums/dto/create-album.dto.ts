import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  year: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;
}
