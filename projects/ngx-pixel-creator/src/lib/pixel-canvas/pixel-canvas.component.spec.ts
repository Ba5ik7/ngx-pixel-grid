import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelCanvasComponent } from './pixel-canvas.component';

describe('PixelCanvasComponent', () => {
  let component: PixelCanvasComponent;
  let fixture: ComponentFixture<PixelCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PixelCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixelCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
