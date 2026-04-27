import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditor2 } from './editor2';

describe('NewEditor2', () => {
  let component: NewEditor2;
  let fixture: ComponentFixture<NewEditor2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEditor2],
    }).compileComponents();

    fixture = TestBed.createComponent(NewEditor2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
