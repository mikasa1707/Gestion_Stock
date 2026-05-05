import { TestBed } from '@angular/core/testing';

import { Fournisseurs } from './fournisseurs';

describe('Fournisseurs', () => {
  let service: Fournisseurs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fournisseurs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
