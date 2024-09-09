import { TestBed } from '@angular/core/testing';

import { FormErrorPrinterService } from './form-error-printer.service';

describe('FormErrorPrinterService', () => {
  let service: FormErrorPrinterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormErrorPrinterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
