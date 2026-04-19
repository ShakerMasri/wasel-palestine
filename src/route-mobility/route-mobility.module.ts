import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteMobilityService } from './route-mobility.service';
import { RouteMobilityController } from './route-mobility.controller';
import { UserReport, ReportVote } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserReport, ReportVote])],
  controllers: [RouteMobilityController],
  providers: [RouteMobilityService],
})
export class RouteMobilityModule {}
