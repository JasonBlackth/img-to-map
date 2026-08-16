import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivergenceCalculator } from './divergence-calculator';

describe('DivergenceCalculator', () => {
  let component: DivergenceCalculator;
  let fixture: ComponentFixture<DivergenceCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivergenceCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivergenceCalculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
