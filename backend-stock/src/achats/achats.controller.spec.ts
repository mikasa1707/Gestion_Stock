import { Test, TestingModule } from '@nestjs/testing';
import { AchatsController } from './achats.controller';

describe('AchatsController', () => {
  let controller: AchatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchatsController],
    }).compile();

    controller = module.get<AchatsController>(AchatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
