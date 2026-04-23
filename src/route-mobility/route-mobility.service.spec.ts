import { Test, TestingModule } from '@nestjs/testing';
import { RouteMobilityService } from './route-mobility.service';

describe('RouteMobilityService', () => {
  let service: RouteMobilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteMobilityService],
    }).compile();

    service = module.get<RouteMobilityService>(RouteMobilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
