import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.css']
})
export class FullscreenComponent {

  @Output() fullscreenActiveChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private fullscreenActive: boolean;

  constructor() {
    this.fullscreenActive = false;
  }

  async fullscreen(): Promise<void> {
    this.fullscreenActive = !this.fullscreenActive;
    this.fullscreenActiveChange.emit(this.fullscreenActive);
  }
}
