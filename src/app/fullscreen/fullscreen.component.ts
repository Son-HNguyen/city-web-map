import {Component, EventEmitter, Output} from '@angular/core';
import {GlobalService} from "../../global.service";
import * as Cesium from "cesium";

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
    /*
    if (!this.fullscreenActive) {
      await Cesium.Fullscreen.requestFullscreen(document.body);
    } else {
      await Cesium.Fullscreen.exitFullscreen();
    }
     */

    this.fullscreenActive = !this.fullscreenActive;
    this.fullscreenActiveChange.emit(this.fullscreenActive);
  }
}
