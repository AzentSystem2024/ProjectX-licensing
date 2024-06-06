import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityGroupComponent } from './facility-group.component';

describe('FacilityGroupComponent', () => {
  let component: FacilityGroupComponent;
  let fixture: ComponentFixture<FacilityGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacilityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
