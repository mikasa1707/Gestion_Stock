import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Unites } from './unites';

describe('Unites', () => {
  let component: Unites;
  let fixture: ComponentFixture<Unites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Unites],
    }).compileComponents();

    fixture = TestBed.createComponent(Unites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
