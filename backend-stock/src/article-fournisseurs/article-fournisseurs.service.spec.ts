import { Test, TestingModule } from '@nestjs/testing';
import { ArticleFournisseursService } from './article-fournisseurs.service';

describe('ArticleFournisseursService', () => {
  let service: ArticleFournisseursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleFournisseursService],
    }).compile();

    service = module.get<ArticleFournisseursService>(ArticleFournisseursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
