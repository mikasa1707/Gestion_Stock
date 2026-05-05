import { Test, TestingModule } from '@nestjs/testing';
import { ConditionnementsService } from './conditionnements.service';

describe('ConditionnementsService', () => {
  let service: ConditionnementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConditionnementsService],
    }).compile();

    service = module.get<ConditionnementsService>(ConditionnementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
