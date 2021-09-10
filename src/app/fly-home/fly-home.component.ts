import {Component} from '@angular/core';
import {UtilityService} from "../../services/utils.service";
import {Workspace} from "../../core/Workspace";

@Component({
  selector: 'app-fly-home',
  templateUrl: './fly-home.component.html',
  styleUrls: ['./fly-home.component.css']
})
export class FlyHomeComponent {

  constructor(private UTILS?: UtilityService) {
  }

  async handleButtonFlyHome() {
    await this.UTILS!.camera.flyToPosition(Workspace.DEFAULT_CAMERA_LOCATION);
    this.UTILS!.snackBar.show('The camera has been moved to the default location.')
  }
}
