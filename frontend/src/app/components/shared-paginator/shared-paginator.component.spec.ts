import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPaginatorComponent } from './shared-paginator.component';

describe('SharedPaginatorComponent', () => {
  let component: SharedPaginatorComponent;
  let fixture: ComponentFixture<SharedPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedPaginatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
