import { Test, TestingModule } from '@nestjs/testing';
import { FichesTechniquesController } from './fiches-techniques.controller';

describe('FichesTechniquesController', () => {
  let controller: FichesTechniquesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FichesTechniquesController],
    }).compile();

    controller = module.get<FichesTechniquesController>(FichesTechniquesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
