import {Component} from '@angular/core';
import {UtilityService} from "../../services/utils.service";
import {GlobalService} from "../../services/global.service";
import {Workspace} from "../../core/Workspace";

@Component({
  selector: 'app-fly-home',
  templateUrl: './fly-home.component.html',
  styleUrls: ['./fly-home.component.css']
})
export class FlyHomeComponent {

  constructor(
    private GLOBALS?: GlobalService,
    private UTILS?: UtilityService
  ) {
  }

  async handleButtonFlyHome() {
    await this.GLOBALS!.GLOBE.CAMERA.flyToPosition(Workspace.DEFAULT_CAMERA_LOCATION);
    this.UTILS!.snackBar.show('The camera has been moved to the default location.')
  }
}
