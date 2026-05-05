import { Test, TestingModule } from '@nestjs/testing';
import { FamillesService } from './familles.service';

describe('FamillesService', () => {
  let service: FamillesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamillesService],
    }).compile();

    service = module.get<FamillesService>(FamillesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
