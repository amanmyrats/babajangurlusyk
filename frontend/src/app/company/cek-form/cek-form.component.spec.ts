import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CekFormComponent } from './cek-form.component';

describe('CekFormComponent', () => {
  let component: CekFormComponent;
  let fixture: ComponentFixture<CekFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CekFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CekFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
