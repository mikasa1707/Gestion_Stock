import { TestBed } from '@angular/core/testing';

import { Achats } from './achats';

describe('Achats', () => {
  let service: Achats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Achats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
