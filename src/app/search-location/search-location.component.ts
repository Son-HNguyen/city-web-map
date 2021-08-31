import {Component} from '@angular/core';
import {UtilityService} from "../../utils.service";
import {GlobalService} from "../../global.service";

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
    this.UTILS!.dialog.search();
  }
}
