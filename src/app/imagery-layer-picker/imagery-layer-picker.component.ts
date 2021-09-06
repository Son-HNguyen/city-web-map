import {Component} from '@angular/core';
import {UtilityService} from "../../utils.service";
import {GlobalService} from "../../global.service";

@Component({
  selector: 'app-imagery-layer-picker',
  templateUrl: './imagery-layer-picker.component.html',
  styleUrls: ['./imagery-layer-picker.component.css']
})
export class ImageryLayerPickerComponent {
  constructor(private GLOBALS?: GlobalService,
              private UTILS?: UtilityService) {
  }

  async handleButtonImageryLayerPicker() {
    await this.UTILS!.dialog.pickImagery();
  }
}
