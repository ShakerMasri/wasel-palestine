// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// <<<<<<< HEAD
// import { Incident } from './entities/incident.entity';
// import { IncidentsService } from './incidents.service';
// import { HttpModule } from '@nestjs/axios';
// import { IncidentsController } from './incidents.controller';
// import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
// import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';

// @Module({

//     imports: [TypeOrmModule.forFeature([Incident, Checkpoint, CheckpointHistory]), HttpModule,],
//     controllers: [IncidentsController],
//     providers: [IncidentsService],
// })
// export class ReportsModule { }
// //
// =======
// import { RouteMobilityController } from '../route-mobility/route-mobility.controller';
// import { RouteMobilityService } from '../route-mobility/route-mobility.service';
// import { UserReport, ReportVote } from '../route-mobility/entities';

// @Module({
//   imports: [TypeOrmModule.forFeature([UserReport, ReportVote])],
//   controllers: [RouteMobilityController],
//   providers: [RouteMobilityService],
// })
// export class RouteMobilityModule {}
// >>>>>>> 2f4a113fd05e464bcbea4d4cd0e6f6d037968205


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

// Imports لشغل الحواجز (Yazan)
import { Incident } from './entities/incident.entity';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { CheckpointHistory } from '../checkpoints/entities/CheckpointHistory.entity';

// Imports لشغل الـ Route Mobility (Team)
import { RouteMobilityController } from '../route-mobility/route-mobility.controller';
import { RouteMobilityService } from '../route-mobility/route-mobility.service';
import { UserReport, ReportVote } from '../route-mobility/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Incident,
      Checkpoint,
      CheckpointHistory,
      UserReport,
      ReportVote
    ]),
    HttpModule
  ],
  controllers: [IncidentsController, RouteMobilityController],
  providers: [IncidentsService, RouteMobilityService],
})
export class ReportsModule { }