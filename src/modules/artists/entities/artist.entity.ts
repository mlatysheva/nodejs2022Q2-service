import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class ArtistModel {
  @ApiProperty({ type: String })
  id?: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  grammy: boolean;
}
