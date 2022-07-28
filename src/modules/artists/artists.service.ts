import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist, PrismaClient } from '@prisma/client';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';

@Injectable()
export class ArtistsService {
  prisma = new PrismaClient();

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const artist = await this.prisma.artist.findFirst({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artist;
  }

  async create(artistData: CreateArtistDto) {
    const newArtist: Artist = await this.prisma.artist.create({
      data: {
        ...artistData,
      },
    });
    return newArtist;
  }

  async update(id: string, updatedArtistData: UpdateArtistDto) {
    await this.findOne(id);
    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: {
        ...updatedArtistData,
      },
    });
    return updatedArtist;
  }

  async delete(id: string) {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const artist = await this.prisma.artist.findFirst({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    await this.prisma.artist.delete({ where: { id } });
  }
}
