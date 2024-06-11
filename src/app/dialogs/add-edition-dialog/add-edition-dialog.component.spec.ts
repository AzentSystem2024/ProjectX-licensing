import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditionDialogComponent } from './add-edition-dialog.component';

describe('AddEditionDialogComponent', () => {
  let component: AddEditionDialogComponent;
  let fixture: ComponentFixture<AddEditionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
