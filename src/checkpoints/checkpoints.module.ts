import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckpointsService } from './checkpoints.service';
import { CheckpointsController } from './checkpoints.controller';
import { Checkpoint } from './entities/checkpoint.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Checkpoint])],
    providers: [CheckpointsService],
    controllers: [CheckpointsController],
    exports: [CheckpointsService],
})
export class CheckpointsModule { }