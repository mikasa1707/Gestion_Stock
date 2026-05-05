import { Test, TestingModule } from '@nestjs/testing';
import { StockageController } from './stockage.controller';

describe('StockageController', () => {
  let controller: StockageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockageController],
    }).compile();

    controller = module.get<StockageController>(StockageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
