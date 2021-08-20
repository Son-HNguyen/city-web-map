import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveCesiumComponent } from './move-cesium.component';

describe('MoveCesiumComponent', () => {
  let component: MoveCesiumComponent;
  let fixture: ComponentFixture<MoveCesiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveCesiumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveCesiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
