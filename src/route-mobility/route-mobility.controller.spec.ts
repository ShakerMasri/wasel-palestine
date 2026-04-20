import { Test, TestingModule } from '@nestjs/testing';
import { RouteMobilityController } from './route-mobility.controller';

describe('RouteMobilityController', () => {
  let controller: RouteMobilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteMobilityController],
    }).compile();

    controller = module.get<RouteMobilityController>(RouteMobilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
