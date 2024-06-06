import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSelectionDialogComponent } from './no-selection-dialog.component';

describe('NoSelectionDialogComponent', () => {
  let component: NoSelectionDialogComponent;
  let fixture: ComponentFixture<NoSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoSelectionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
