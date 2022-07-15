import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateArtistDto } from './create-artist.dto';
import { PartialType } from '@nestjs/graphql';
// import { isNull, isNullOrUndefined } from 'util';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  // @ValidateIf((_, value) => !isNull(value))
  // @IsUUID('4')
  // id: string | null

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  grammy: boolean;
}
