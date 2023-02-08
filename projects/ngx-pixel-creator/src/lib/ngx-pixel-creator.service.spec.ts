import { TestBed } from '@angular/core/testing';

import { NgxPixelCreatorService } from './ngx-pixel-creator.service';

describe('NgxPixelCreatorService', () => {
  let service: NgxPixelCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxPixelCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
