import { TestBed } from '@angular/core/testing';

import { CekService } from './cek.service';

describe('CekService', () => {
  let service: CekService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CekService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
