import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  IsUUID,
} from 'class-validator';
import { InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsUUID('4')
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;
}
