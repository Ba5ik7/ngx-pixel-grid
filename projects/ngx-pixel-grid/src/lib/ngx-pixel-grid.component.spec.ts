import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPixelGridComponent } from './ngx-pixel-grid.component';

describe('NgxPixelGridComponent', () => {
  let component: NgxPixelGridComponent;
  let fixture: ComponentFixture<NgxPixelGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxPixelGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxPixelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
