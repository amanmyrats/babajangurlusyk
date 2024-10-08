import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitFormComponent } from './unit-form.component';

describe('UnitFormComponent', () => {
  let component: UnitFormComponent;
  let fixture: ComponentFixture<UnitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
