import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  artistId: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  albumId: string | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  duration: number;
}
