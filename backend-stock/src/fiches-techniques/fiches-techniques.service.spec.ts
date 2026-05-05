import { Test, TestingModule } from '@nestjs/testing';
import { FichesTechniquesService } from './fiches-techniques.service';

describe('FichesTechniquesService', () => {
  let service: FichesTechniquesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FichesTechniquesService],
    }).compile();

    service = module.get<FichesTechniquesService>(FichesTechniquesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
