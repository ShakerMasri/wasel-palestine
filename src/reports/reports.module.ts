import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { UserReport } from './entities/user-report.entity';
import { IncidentsService } from './incidents.service';
import { IncidentsController, ReportsController } from './incidents.controller';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Incident,
      UserReport,
      Checkpoint,
      CheckpointHistory,
    ]),
  ],
  controllers: [IncidentsController, ReportsController],
  providers: [IncidentsService],
})
export class ReportsModule {}
