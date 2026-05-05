import { Test, TestingModule } from '@nestjs/testing';
import { TransfertsController } from './transferts.controller';

describe('TransfertsController', () => {
  let controller: TransfertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfertsController],
    }).compile();

    controller = module.get<TransfertsController>(TransfertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
