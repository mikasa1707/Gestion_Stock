import { Test, TestingModule } from '@nestjs/testing';
import { ArticleFournisseursController } from './article-fournisseurs.controller';

describe('ArticleFournisseursController', () => {
  let controller: ArticleFournisseursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleFournisseursController],
    }).compile();

    controller = module.get<ArticleFournisseursController>(ArticleFournisseursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
