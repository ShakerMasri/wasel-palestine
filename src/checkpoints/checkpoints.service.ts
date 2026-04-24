import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkpoint } from './entities/checkpoint.entity';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';

@Injectable()
export class CheckpointsService {
  constructor(
    @InjectRepository(Checkpoint)
    private readonly repo: Repository<Checkpoint>,
  ) {}

  async create(createDto: CreateCheckpointDto) {
    const checkpoint = this.repo.create({
      ...createDto,
      currentStatus: createDto.currentStatus ?? 'Open',
    });

    return await this.repo.save(checkpoint);
  }

  async findAll() {
    return await this.repo.find({
      relations: ['incidents', 'histories'],
      order: { id: 'ASC' },
    });
  }

  async update(id: number, updateDto: UpdateCheckpointDto) {
    const checkpoint = await this.repo.findOne({ where: { id } });

    if (!checkpoint) {
      throw new NotFoundException(`Checkpoint ${id} not found`);
    }

    Object.assign(checkpoint, updateDto);
    return await this.repo.save(checkpoint);
  }
}
