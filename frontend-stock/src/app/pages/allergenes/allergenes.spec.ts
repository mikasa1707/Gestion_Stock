import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allergenes } from './allergenes';

describe('Allergenes', () => {
  let component: Allergenes;
  let fixture: ComponentFixture<Allergenes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allergenes],
    }).compileComponents();

    fixture = TestBed.createComponent(Allergenes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
