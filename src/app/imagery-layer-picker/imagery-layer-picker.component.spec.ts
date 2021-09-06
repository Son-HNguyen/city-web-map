import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageryLayerPickerComponent } from './imagery-layer-picker.component';

describe('ImageryLayerPickerComponent', () => {
  let component: ImageryLayerPickerComponent;
  let fixture: ComponentFixture<ImageryLayerPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageryLayerPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageryLayerPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
