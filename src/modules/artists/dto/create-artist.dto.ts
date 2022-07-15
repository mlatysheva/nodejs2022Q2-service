import { IsString, IsNotEmpty } from 'class-validator';
import { InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
@InputType()
export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string;

  @IsNotEmpty()
  @ApiPropertyOptional({ type: Boolean })
  grammy: boolean;
}
