import { Test, TestingModule } from '@nestjs/testing';
import { AllergenesController } from './allergenes.controller';

describe('AllergenesController', () => {
  let controller: AllergenesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllergenesController],
    }).compile();

    controller = module.get<AllergenesController>(AllergenesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
