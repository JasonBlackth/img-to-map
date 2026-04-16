import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editor2 } from './editor2';

describe('Editor2', () => {
  let component: Editor2;
  let fixture: ComponentFixture<Editor2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editor2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editor2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
