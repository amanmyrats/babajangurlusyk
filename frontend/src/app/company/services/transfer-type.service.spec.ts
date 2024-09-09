import { TestBed } from '@angular/core/testing';

import { TransferTypeService } from './transfer-type.service';

describe('TransferTypeService', () => {
  let service: TransferTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
