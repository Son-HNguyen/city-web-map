import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonToggleLayoutComponent } from './button-toggle-layout.component';

describe('ButtonToggleLayoutComponent', () => {
  let component: ButtonToggleLayoutComponent;
  let fixture: ComponentFixture<ButtonToggleLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonToggleLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonToggleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
