import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { UserReport } from './entities/user-report.entity';
import { ReportVote } from './entities/report-vote.entity';
import { ModerationLog } from './entities/moderation-log.entity';
import { User } from '../auth/entities/user.entity';
import { IncidentsService } from './incidents.service';
import { IncidentsController, ReportsController } from './incidents.controller';
import { ReportVotesService } from './report-votes.service';
import { ReportVotesController } from './report-votes.controller';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Incident,
      UserReport,
      ReportVote,
      ModerationLog,
      User,
      Checkpoint,
      CheckpointHistory,
    ]),
  ],
  controllers: [IncidentsController, ReportsController, ReportVotesController],
  providers: [IncidentsService, ReportVotesService],
})
export class ReportsModule {}
