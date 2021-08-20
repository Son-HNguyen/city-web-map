import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.css']
})
export class FullscreenComponent {

  @Input() fullscreenActive: boolean;
  @Output() fullscreenActiveChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  buttonIcon: ButtonFullscreenIcons;
  buttonTooltip: ButtonFullscreenTooltips;

  constructor() {
    this.fullscreenActive = false;
    this.buttonIcon = ButtonFullscreenIcons.ON;
    this.buttonTooltip = ButtonFullscreenTooltips.ON;
  }

  async fullscreen(): Promise<void> {
    this.fullscreenActive = !this.fullscreenActive;
    this.fullscreenActiveChange.emit(this.fullscreenActive);
  }

  ngOnChanges(val: SimpleChanges): void {
    if (this.fullscreenActive) {
      this.buttonIcon = ButtonFullscreenIcons.OFF;
      this.buttonTooltip = ButtonFullscreenTooltips.OFF;
    } else {
      this.buttonIcon = ButtonFullscreenIcons.ON;
      this.buttonTooltip = ButtonFullscreenTooltips.ON;
    }
  }
}

enum ButtonFullscreenIcons {
  ON = 'fullscreen',
  OFF = 'fullscreen_exit'
}

enum ButtonFullscreenTooltips {
  ON = 'Fullscreen | F11',
  OFF = 'Exit fullscreen | F11'
}
