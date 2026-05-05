import { TestBed } from '@angular/core/testing';

import { Conditionnements } from './conditionnements';

describe('Conditionnements', () => {
  let service: Conditionnements;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conditionnements);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
