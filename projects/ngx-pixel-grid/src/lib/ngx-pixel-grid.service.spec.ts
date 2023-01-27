import { TestBed } from '@angular/core/testing';

import { NgxPixelGridService } from './ngx-pixel-grid.service';

describe('NgxPixelGridService', () => {
  let service: NgxPixelGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxPixelGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
