import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {Workspace} from "../../core/Workspace";

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
    this.selectedValue = Workspace.getLayout(this.GLOBALS!.WORKSPACE.gridLayout);
  }

  changeGridLayout(value: string) {
    this.buttonToggleValue.emit(value);
  }

  ngOnChanges(val: SimpleChanges): void {
    this.selectedValue = this.changedLayout;
  }
}
