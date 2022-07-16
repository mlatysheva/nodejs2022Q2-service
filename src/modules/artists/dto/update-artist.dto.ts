import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateArtistDto } from './create-artist.dto';
import { PartialType } from '@nestjs/graphql';
// import { isNull, isNullOrUndefined } from 'util';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  grammy: boolean;
}
