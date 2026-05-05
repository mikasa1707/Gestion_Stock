import { Test, TestingModule } from '@nestjs/testing';
import { StockageService } from './stockage';

describe('StockageService', () => {
  let service: StockageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockageService],
    }).compile();

    service = module.get<StockageService>(StockageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
