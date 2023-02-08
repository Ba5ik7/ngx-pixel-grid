import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPixelCreatorComponent } from './ngx-pixel-creator.component';

describe('NgxPixelCreatorComponent', () => {
  let component: NgxPixelCreatorComponent;
  let fixture: ComponentFixture<NgxPixelCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxPixelCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxPixelCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
