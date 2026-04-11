import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkpoint } from './entities/checkpoint.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Checkpoint])],
    controllers: [],
    providers: [],
})
export class CheckpointsModule { }