import { Test, TestingModule } from '@nestjs/testing';
import { AllergenesService } from './allergenes.service';

describe('AllergenesService', () => {
  let service: AllergenesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllergenesService],
    }).compile();

    service = module.get<AllergenesService>(AllergenesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
