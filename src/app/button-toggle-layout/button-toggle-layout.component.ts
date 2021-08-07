import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GlobalService} from "../../global.service";
import _ = require("lodash");

@Component({
  selector: 'app-button-toggle-layout',
  templateUrl: './button-toggle-layout.component.html',
  styleUrls: ['./button-toggle-layout.component.css']
})
export class ButtonToggleLayoutComponent implements OnInit {

  @Input() changedLayout!: string | undefined;
  @Output() buttonToggleValue = new EventEmitter<string>();

  selectedValue: string | undefined;

  constructor(private GLOBALS?: GlobalService) {
  }

  ngOnInit(): void {
    // Check if the saved grid layout is one of the default values
    if (_.isEqual(this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutLeftGlobe, this.GLOBALS!.WORKSPACE.gridLayout)) {
      this.selectedValue = 'left';
    } else if (_.isEqual(this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutCenterGlobe, this.GLOBALS!.WORKSPACE.gridLayout)) {
      this.selectedValue = 'center';
    } else if (_.isEqual(this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutRightGlobe, this.GLOBALS!.WORKSPACE.gridLayout)) {
      this.selectedValue = 'right';
    } else {
      this.selectedValue = undefined;
    }
  }

  changeGridLayout(value: string) {
    this.buttonToggleValue.emit(value);
  }

  ngOnChanges(val: SimpleChanges): void {
    this.selectedValue = this.changedLayout;
  }
}
