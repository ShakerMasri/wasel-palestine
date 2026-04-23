import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { RouteMobilityService } from './route-mobility.service';
import { RouteMode } from './dto/estimate-route.dto';

describe('RouteMobilityService', () => {
  let service: RouteMobilityService;

  const mockDataSource = {
    query: jest.fn(),
  };

  beforeEach(() => {
    mockDataSource.query.mockImplementation((sql: string) => {
      if (sql.includes('FROM checkpoints')) {
        return Promise.resolve([
          {
            id: 1,
            latitude: 32.12,
            longitude: 35.22,
            status: 'active',
            name: 'Checkpoint A',
          },
        ]);
      }

      if (sql.includes('FROM incidents')) {
        return Promise.resolve([
          {
            id: 1,
            latitude: 32.11,
            longitude: 35.21,
            status: 'open',
            severity: 'medium',
            type: 'delay',
          },
        ]);
      }

      return Promise.resolve([]);
    });
  });

  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RouteMobilityService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<RouteMobilityService>(RouteMobilityService);
    expect(service).toBeDefined();
  });

  it('should estimate a route successfully', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RouteMobilityService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<RouteMobilityService>(RouteMobilityService);

    const result = await service.estimateRoute({
      startLatitude: 32.1,
      startLongitude: 35.2,
      endLatitude: 32.2,
      endLongitude: 35.3,
      mode: RouteMode.BALANCED,
      avoidCheckpoints: true,
      avoidAreas: [],
    });

    expect(result).toHaveProperty('estimatedDistanceKm');
    expect(result).toHaveProperty('estimatedDurationMinutes');
    expect(result.metadata.nearbyCheckpointsCount).toBeGreaterThanOrEqual(0);
    expect(result.metadata.nearbyIncidentsCount).toBeGreaterThanOrEqual(0);
  });
});
