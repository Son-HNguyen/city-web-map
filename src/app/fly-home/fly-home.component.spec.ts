import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyHomeComponent } from './fly-home.component';

describe('FlyHomeComponent', () => {
  let component: FlyHomeComponent;
  let fixture: ComponentFixture<FlyHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlyHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
