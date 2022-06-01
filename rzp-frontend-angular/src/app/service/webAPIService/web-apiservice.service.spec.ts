import { TestBed } from '@angular/core/testing';

import { WebAPIServiceService } from './web-apiservice.service';

describe('WebAPIServiceService', () => {
  let service: WebAPIServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebAPIServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
