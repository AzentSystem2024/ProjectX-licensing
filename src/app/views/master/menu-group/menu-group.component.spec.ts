import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGroupComponent } from './menu-group.component';

describe('MenuGroupComponent', () => {
  let component: MenuGroupComponent;
  let fixture: ComponentFixture<MenuGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
