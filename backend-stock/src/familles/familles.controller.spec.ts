import { Test, TestingModule } from '@nestjs/testing';
import { FamillesController } from './familles.controller';

describe('FamillesController', () => {
  let controller: FamillesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FamillesController],
    }).compile();

    controller = module.get<FamillesController>(FamillesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
