import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editor1 } from './editor1';

describe('Editor1', () => {
  let component: Editor1;
  let fixture: ComponentFixture<Editor1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editor1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editor1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
