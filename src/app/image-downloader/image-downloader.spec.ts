import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDownloader } from './image-downloader';

describe('ImageDownloader', () => {
  let component: ImageDownloader;
  let fixture: ComponentFixture<ImageDownloader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageDownloader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageDownloader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
