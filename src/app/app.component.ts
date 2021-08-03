import {ChangeDetectionStrategy, Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {environment as ENV} from '../environments/environment';
import {CesiumCameraPosition, UtilityCamera} from '../utilities/utility.camera';
import {CompactType, GridsterConfig, GridsterItem, GridType} from "angular-gridster2";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'city-web-map';
  options!: GridsterConfig;
  dashboard!: Array<GridsterItem>;

  constructor(private cookieService: CookieService) {
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    this.cookieService.set(ENV.cookieNames.cameraPosition, JSON.stringify(UtilityCamera.getPosition()), ENV.cookieExpireDefault);
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      maxCols: 20,
      maxRows: 20,
      pushItems: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      // Menu on the left
      {cols: 2, rows: 20, y: 0, x: 0},
      // Widgets on top
      {cols: 13, rows: 2, y: 0, x: 2},
      // Widgets on the right
      {cols: 5, rows: 10, y: 0, x: 15},
      {cols: 5, rows: 10, y: 10, x: 15},
      // Widgets at the bottom
      {cols: 13, rows: 2, y: 18, x: 2},
      // Cesium app in the center
      {cols: 13, rows: 16, y: 2, x: 2}
    ];
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItem): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push({x: 0, y: 0, cols: 1, rows: 1});
  }
}
