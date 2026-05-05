import { TestBed } from '@angular/core/testing';

import { ArticleFournisseurs } from './article-fournisseurs';

describe('ArticleFournisseurs', () => {
  let service: ArticleFournisseurs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleFournisseurs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
