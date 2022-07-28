import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { uuIdValidateV4 } from '../../utils/uuIdValidate';

@Injectable()
export class TracksService {
  prisma = new PrismaClient();

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException('Invalid UUID.');
    }
    const track = await this.prisma.track.findFirst({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async create(trackData: CreateTrackDto) {
    const newTrack: Track = await this.prisma.track.create({
      data: {
        ...trackData,
      },
    });
    return newTrack;
  }

  async update(id: string, updatedTrackData: UpdateTrackDto) {
    await this.findOne(id);
    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: {
        ...updatedTrackData,
      },
    });
    return updatedTrack;
  }

  async delete(id: string) {
    if (!uuIdValidateV4(id)) {
      throw new BadRequestException(`Invalid UUID.`);
    }
    const track = await this.prisma.track.findFirst({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    await this.prisma.track.delete({ where: { id } });
  }
}
