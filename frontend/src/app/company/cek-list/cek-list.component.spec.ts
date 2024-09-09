import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CekListComponent } from './cek-list.component';

describe('CekListComponent', () => {
  let component: CekListComponent;
  let fixture: ComponentFixture<CekListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CekListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CekListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
