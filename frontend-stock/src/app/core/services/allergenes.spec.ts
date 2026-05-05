import { TestBed } from '@angular/core/testing';

import { Allergenes } from './allergenes';

describe('Allergenes', () => {
  let service: Allergenes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Allergenes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
