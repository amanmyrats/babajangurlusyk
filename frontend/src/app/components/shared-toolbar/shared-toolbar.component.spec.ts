import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedToolbarComponent } from './shared-toolbar.component';

describe('SharedToolbarComponent', () => {
  let component: SharedToolbarComponent;
  let fixture: ComponentFixture<SharedToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedToolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
