import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Familles } from './familles';

describe('Familles', () => {
  let component: Familles;
  let fixture: ComponentFixture<Familles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Familles],
    }).compileComponents();

    fixture = TestBed.createComponent(Familles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
