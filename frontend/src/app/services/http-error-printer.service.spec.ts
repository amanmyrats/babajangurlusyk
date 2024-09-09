import { TestBed } from '@angular/core/testing';

import { HttpErrorPrinterService } from './http-error-printer.service';

describe('HttpErrorPrinterService', () => {
  let service: HttpErrorPrinterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpErrorPrinterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
