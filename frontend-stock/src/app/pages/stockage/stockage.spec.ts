import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stockage } from './stockage';

describe('Stockage', () => {
  let component: Stockage;
  let fixture: ComponentFixture<Stockage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stockage],
    }).compileComponents();

    fixture = TestBed.createComponent(Stockage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
