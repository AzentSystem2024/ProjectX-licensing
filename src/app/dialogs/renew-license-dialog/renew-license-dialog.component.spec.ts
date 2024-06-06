import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewLicenseDialogComponent } from './renew-license-dialog.component';

describe('RenewLicenseDialogComponent', () => {
  let component: RenewLicenseDialogComponent;
  let fixture: ComponentFixture<RenewLicenseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewLicenseDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenewLicenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
