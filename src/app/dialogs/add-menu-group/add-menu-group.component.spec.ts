import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuGroupComponent } from './add-menu-group.component';

describe('AddMenuGroupComponent', () => {
  let component: AddMenuGroupComponent;
  let fixture: ComponentFixture<AddMenuGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMenuGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMenuGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
