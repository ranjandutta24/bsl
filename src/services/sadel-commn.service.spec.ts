/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SadelCommnService } from './sadel-commn.service';

describe('Service: SadelCommn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SadelCommnService]
    });
  });

  it('should ...', inject([SadelCommnService], (service: SadelCommnService) => {
    expect(service).toBeTruthy();
  }));
});
