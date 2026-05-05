import { TestBed } from '@angular/core/testing';

import { Familles } from './familles';

describe('Familles', () => {
  let service: Familles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Familles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
