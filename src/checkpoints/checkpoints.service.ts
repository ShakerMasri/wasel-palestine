import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkpoint } from './entities/checkpoint.entity';

@Injectable()
export class CheckpointsService {
    constructor(
        @InjectRepository(Checkpoint)
        private repo: Repository<Checkpoint>,
    ) { }

    async create(createDto: any) {
        const checkpoint = this.repo.create(createDto);
        return await this.repo.save(checkpoint);
    }

    async findAll() {
        return await this.repo.find();
    }
}