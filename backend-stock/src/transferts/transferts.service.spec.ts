import { Test, TestingModule } from '@nestjs/testing';
import { TransfertsService } from './transferts.service';

describe('TransfertsService', () => {
  let service: TransfertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransfertsService],
    }).compile();

    service = module.get<TransfertsService>(TransfertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
