import { TestBed } from '@angular/core/testing';

import { Unites } from './unites';

describe('Unites', () => {
  let service: Unites;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Unites);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
