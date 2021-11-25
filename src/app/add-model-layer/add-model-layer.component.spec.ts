import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModelLayerComponent } from './add-model-layer.component';

describe('AddModelLayerComponent', () => {
  let component: AddModelLayerComponent;
  let fixture: ComponentFixture<AddModelLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModelLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModelLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
