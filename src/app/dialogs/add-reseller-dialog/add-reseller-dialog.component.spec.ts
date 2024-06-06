import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResellerDialogComponent } from './add-reseller-dialog.component';

describe('AddResellerDialogComponent', () => {
  let component: AddResellerDialogComponent;
  let fixture: ComponentFixture<AddResellerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddResellerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddResellerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
