import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Checkpoint } from '../checkpoints/entities/checkpoint.entity';
import { Incident } from '../reports/entities/incident.entity';
import { EstimateRouteDto, RouteMode } from './dto/estimate-route.dto';
import { ExternalApiService } from '../external-api/external-api.service';

type Point = {
  latitude: number;
  longitude: number;
};

type RouteFactor = {
  type: string;
  message: string;
  impactDistanceKm: number;
  impactDurationMinutes: number;
};

@Injectable()
export class RouteMobilityService {
  constructor(
    @InjectRepository(Checkpoint)
    private readonly checkpointRepo: Repository<Checkpoint>,

    @InjectRepository(Incident)
    private readonly incidentRepo: Repository<Incident>,

    private readonly externalApiService: ExternalApiService,
  ) {}

  async estimateRoute(dto: EstimateRouteDto) {
    const start: Point = {
      latitude: dto.startLatitude,
      longitude: dto.startLongitude,
    };

    const end: Point = {
      latitude: dto.endLatitude,
      longitude: dto.endLongitude,
    };

    const mode = dto.mode ?? RouteMode.BALANCED;
    const avoidCheckpoints = dto.avoidCheckpoints ?? false;
    const avoidAreas = dto.avoidAreas ?? [];
    const useExternalRouting = dto.useExternalRouting ?? true;

    const directDistanceKm = this.haversineKm(start, end);
    const baseRoadFactor = this.getBaseRoadFactor(mode);
    const averageSpeedKmh = this.getAverageSpeed(mode);

    const externalRoute = useExternalRouting
      ? await this.externalApiService.getDrivingRoute(start, end)
      : null;

    let estimatedDistanceKm: number;
    let estimatedDurationMinutes: number;
    let routingProvider: string;

    if (externalRoute) {
      estimatedDistanceKm = externalRoute.distanceKm;
      estimatedDurationMinutes = externalRoute.durationMinutes;
      routingProvider = externalRoute.provider;
    } else {
      estimatedDistanceKm = directDistanceKm * baseRoadFactor;
      estimatedDurationMinutes = (estimatedDistanceKm / averageSpeedKmh) * 60;
      routingProvider = 'local_heuristic';
    }

    const factors: RouteFactor[] = [];

    if (externalRoute) {
      const modeAdjustment = this.getExternalModeAdjustment(mode);

      if (
        modeAdjustment.distanceMultiplier !== 1 ||
        modeAdjustment.durationMultiplier !== 1
      ) {
        const oldDistance = estimatedDistanceKm;
        const oldDuration = estimatedDurationMinutes;

        estimatedDistanceKm *= modeAdjustment.distanceMultiplier;
        estimatedDurationMinutes *= modeAdjustment.durationMultiplier;

        factors.push({
          type: 'route_mode',
          message: modeAdjustment.message,
          impactDistanceKm: this.round(estimatedDistanceKm - oldDistance),
          impactDurationMinutes: this.round(
            estimatedDurationMinutes - oldDuration,
          ),
        });
      }
    }

    const checkpoints = await this.checkpointRepo.find();

    const incidents = await this.incidentRepo.find({
      relations: ['checkpoint'],
    });

    const nearbyCheckpoints = checkpoints.filter((checkpoint) => {
      if (checkpoint.latitude == null || checkpoint.longitude == null) {
        return false;
      }

      return this.isPointNearSegment(
        start,
        end,
        {
          latitude: Number(checkpoint.latitude),
          longitude: Number(checkpoint.longitude),
        },
        5,
      );
    });

    const nearbyIncidents = incidents.filter((incident) => {
      if (!incident.isVerified) return false;
      if (!incident.checkpoint) return false;

      const checkpoint = incident.checkpoint as any;

      if (checkpoint.latitude == null || checkpoint.longitude == null) {
        return false;
      }

      return this.isPointNearSegment(
        start,
        end,
        {
          latitude: Number(checkpoint.latitude),
          longitude: Number(checkpoint.longitude),
        },
        5,
      );
    });

    if (nearbyCheckpoints.length > 0) {
      const checkpointPenaltyDistance = avoidCheckpoints
        ? estimatedDistanceKm * 0.05 * nearbyCheckpoints.length
        : estimatedDistanceKm * 0.01 * nearbyCheckpoints.length;

      const checkpointPenaltyMinutes = avoidCheckpoints
        ? 6 * nearbyCheckpoints.length
        : 3 * nearbyCheckpoints.length;

      estimatedDistanceKm += checkpointPenaltyDistance;
      estimatedDurationMinutes += checkpointPenaltyMinutes;

      factors.push({
        type: 'checkpoints',
        message: avoidCheckpoints
          ? `Route adjusted to avoid ${nearbyCheckpoints.length} nearby checkpoint(s).`
          : `${nearbyCheckpoints.length} checkpoint(s) may slow the route.`,
        impactDistanceKm: this.round(checkpointPenaltyDistance),
        impactDurationMinutes: this.round(checkpointPenaltyMinutes),
      });
    }

    if (nearbyIncidents.length > 0) {
      let incidentPenaltyDistance = 0;
      let incidentPenaltyMinutes = 0;

      for (const incident of nearbyIncidents) {
        const weight = this.getSeverityWeight(incident.severity);
        incidentPenaltyDistance += estimatedDistanceKm * 0.015 * weight;
        incidentPenaltyMinutes += 4 * weight;
      }

      estimatedDistanceKm += incidentPenaltyDistance;
      estimatedDurationMinutes += incidentPenaltyMinutes;

      factors.push({
        type: 'incidents',
        message: `${nearbyIncidents.length} verified incident(s) may affect the route.`,
        impactDistanceKm: this.round(incidentPenaltyDistance),
        impactDurationMinutes: this.round(incidentPenaltyMinutes),
      });
    }

    let affectedAreas = 0;

    for (const area of avoidAreas) {
      const intersects = this.lineIntersectsRectangle(
        start,
        end,
        area.minLatitude,
        area.maxLatitude,
        area.minLongitude,
        area.maxLongitude,
      );

      if (intersects) {
        affectedAreas += 1;
      }
    }

    if (affectedAreas > 0) {
      const areaPenaltyDistance = estimatedDistanceKm * 0.08 * affectedAreas;
      const areaPenaltyMinutes = 8 * affectedAreas;

      estimatedDistanceKm += areaPenaltyDistance;
      estimatedDurationMinutes += areaPenaltyMinutes;

      factors.push({
        type: 'avoid_areas',
        message: `Route detoured to avoid ${affectedAreas} requested area(s).`,
        impactDistanceKm: this.round(areaPenaltyDistance),
        impactDurationMinutes: this.round(areaPenaltyMinutes),
      });
    }

    estimatedDistanceKm = this.round(estimatedDistanceKm);
    estimatedDurationMinutes = this.round(estimatedDurationMinutes);

    return {
      start,
      end,
      estimatedDistanceKm,
      estimatedDurationMinutes,
      metadata: {
        mode,
        routingProvider,
        useExternalRouting,
        directDistanceKm: this.round(directDistanceKm),
        baseRoadFactor,
        averageSpeedKmh,
        avoidCheckpoints,
        avoidedAreasCount: avoidAreas.length,
        nearbyCheckpointsCount: nearbyCheckpoints.length,
        nearbyIncidentsCount: nearbyIncidents.length,
        externalRoute: externalRoute
          ? {
              provider: externalRoute.provider,
              distanceKm: externalRoute.distanceKm,
              durationMinutes: externalRoute.durationMinutes,
              cached: externalRoute.metadata.cached,
            }
          : null,
        factors,
        summary: `Estimated route in ${mode} mode using ${routingProvider}: ${estimatedDistanceKm} km, ${estimatedDurationMinutes} minutes. Factors considered: ${nearbyCheckpoints.length} checkpoint(s), ${nearbyIncidents.length} verified incident(s), ${avoidAreas.length} avoided area(s).`,
      },
    };
  }

  private getBaseRoadFactor(mode: RouteMode): number {
    switch (mode) {
      case RouteMode.FASTEST:
        return 1.18;
      case RouteMode.SAFEST:
        return 1.35;
      default:
        return 1.25;
    }
  }

  private getAverageSpeed(mode: RouteMode): number {
    switch (mode) {
      case RouteMode.FASTEST:
        return 60;
      case RouteMode.SAFEST:
        return 35;
      default:
        return 45;
    }
  }

  private getExternalModeAdjustment(mode: RouteMode): {
    distanceMultiplier: number;
    durationMultiplier: number;
    message: string;
  } {
    switch (mode) {
      case RouteMode.FASTEST:
        return {
          distanceMultiplier: 1,
          durationMultiplier: 0.95,
          message: 'Fastest mode prioritizes lower travel time.',
        };

      case RouteMode.SAFEST:
        return {
          distanceMultiplier: 1.08,
          durationMultiplier: 1.12,
          message: 'Safest mode allows a longer route to reduce mobility risk.',
        };

      default:
        return {
          distanceMultiplier: 1,
          durationMultiplier: 1,
          message: 'Balanced mode keeps the external route estimate unchanged.',
        };
    }
  }

  private getSeverityWeight(severity?: string): number {
    const normalized = (severity ?? '').toLowerCase();

    if (normalized.includes('high') || normalized.includes('critical')) {
      return 2.5;
    }

    if (normalized.includes('medium')) {
      return 1.5;
    }

    return 1;
  }

  private haversineKm(a: Point, b: Point): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;

    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);

    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

    return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
  }

  private isPointNearSegment(
    start: Point,
    end: Point,
    point: Point,
    thresholdKm: number,
  ): boolean {
    const distanceToStart = this.haversineKm(start, point);
    const distanceToEnd = this.haversineKm(end, point);
    const segmentDistance = this.haversineKm(start, end);

    return distanceToStart + distanceToEnd <= segmentDistance + thresholdKm;
  }

  private lineIntersectsRectangle(
    start: Point,
    end: Point,
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number,
  ): boolean {
    const points = [
      start,
      end,
      {
        latitude: (start.latitude + end.latitude) / 2,
        longitude: (start.longitude + end.longitude) / 2,
      },
    ];

    return points.some(
      (p) =>
        p.latitude >= minLat &&
        p.latitude <= maxLat &&
        p.longitude >= minLng &&
        p.longitude <= maxLng,
    );
  }

  private round(value: number): number {
    return Number(value.toFixed(2));
  }
}
