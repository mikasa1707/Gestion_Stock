import { Test, TestingModule } from '@nestjs/testing';
import { AchatsService } from './achats.service';

describe('AchatsService', () => {
  let service: AchatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchatsService],
    }).compile();

    service = module.get<AchatsService>(AchatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
