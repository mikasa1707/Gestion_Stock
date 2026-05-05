import { Test, TestingModule } from '@nestjs/testing';
import { UnitesService } from './unites.service';

describe('UnitesService', () => {
  let service: UnitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitesService],
    }).compile();

    service = module.get<UnitesService>(UnitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
