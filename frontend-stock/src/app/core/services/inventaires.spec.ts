import { TestBed } from '@angular/core/testing';

import { Inventaires } from './inventaires';

describe('Inventaires', () => {
  let service: Inventaires;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Inventaires);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
