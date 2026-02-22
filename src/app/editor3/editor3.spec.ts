import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editor3 } from './editor3';

describe('Editor3', () => {
  let component: Editor3;
  let fixture: ComponentFixture<Editor3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editor3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editor3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
