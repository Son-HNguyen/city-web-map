import {Component} from '@angular/core';
import {UtilityService} from "../../utils.service";
import {GlobalService} from "../../global.service";
import * as Cesium from "cesium";

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.css']
})
export class SearchLocationComponent {

  constructor(private GLOBALS?: GlobalService,
              private UTILS?: UtilityService) {
  }

  handleSearch() {
    // TODO Use auto-complete?
    // TODO When F3 is pressed multiple times?
    this.UTILS!.dialog.search();
  }
}
