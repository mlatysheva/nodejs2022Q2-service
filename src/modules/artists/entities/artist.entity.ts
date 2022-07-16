import { IsBoolean, IsString } from 'class-validator';
export class ArtistModel {
  id?: string;

  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
