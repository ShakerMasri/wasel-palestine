import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteMobilityController } from './route-mobility.controller';
import { RouteMobilityService } from './route-mobility.service';
import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { Incident } from '../reports/entities/incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkpoint, Incident])],
  controllers: [RouteMobilityController],
  providers: [RouteMobilityService],
})
export class RouteMobilityModule {}
