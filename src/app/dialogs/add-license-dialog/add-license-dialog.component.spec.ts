import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLicenseDialogComponent } from './add-license-dialog.component';

describe('AddLicenseDialogComponent', () => {
  let component: AddLicenseDialogComponent;
  let fixture: ComponentFixture<AddLicenseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLicenseDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLicenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
