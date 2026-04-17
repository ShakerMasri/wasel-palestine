import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { IncidentsService } from './incidents.service';
import { HttpModule } from '@nestjs/axios';
import { IncidentsController } from './incidents.controller';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';

@Module({

    imports: [TypeOrmModule.forFeature([Incident, Checkpoint, CheckpointHistory]), HttpModule,],
    controllers: [IncidentsController],
    providers: [IncidentsService],
})
export class ReportsModule { }
//