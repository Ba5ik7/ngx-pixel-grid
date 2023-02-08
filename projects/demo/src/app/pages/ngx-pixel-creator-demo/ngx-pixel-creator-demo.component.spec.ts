import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPixelCreatorDemoComponent } from './ngx-pixel-creator-demo.component';

describe('NgxPixelCreatorDemoComponent', () => {
  let component: NgxPixelCreatorDemoComponent;
  let fixture: ComponentFixture<NgxPixelCreatorDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxPixelCreatorDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxPixelCreatorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
