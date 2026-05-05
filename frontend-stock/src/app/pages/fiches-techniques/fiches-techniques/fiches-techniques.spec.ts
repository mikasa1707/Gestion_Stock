import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesTechniques } from './fiches-techniques';

describe('FichesTechniques', () => {
  let component: FichesTechniques;
  let fixture: ComponentFixture<FichesTechniques>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichesTechniques],
    }).compileComponents();

    fixture = TestBed.createComponent(FichesTechniques);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
