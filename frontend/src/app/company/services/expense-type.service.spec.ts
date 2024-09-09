import { TestBed } from '@angular/core/testing';

import { ExpenseTypeService } from './expense-type.service';

describe('ExpenseTypeService', () => {
  let service: ExpenseTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
