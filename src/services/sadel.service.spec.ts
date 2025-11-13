import { TestBed } from '@angular/core/testing';

import { SadelService } from './sadel.service';

describe('SadelService', () => {
  let service: SadelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SadelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
