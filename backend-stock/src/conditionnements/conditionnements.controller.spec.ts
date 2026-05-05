import { Test, TestingModule } from '@nestjs/testing';
import { ConditionnementsController } from './conditionnements.controller';

describe('ConditionnementsController', () => {
  let controller: ConditionnementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionnementsController],
    }).compile();

    controller = module.get<ConditionnementsController>(ConditionnementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
