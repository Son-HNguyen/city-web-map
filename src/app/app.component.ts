import {ChangeDetectionStrategy, Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {CompactType, GridsterConfig, GridsterItem, GridType} from "angular-gridster2";
import {GlobalService} from "../global.service";
import {UtilityService} from "../utils.service";

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

  constructor(
    private cookieService?: CookieService,
    private GLOBALS?: GlobalService,
    private UTILS?: UtilityService) {
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    this.cookieService!.set(
      this.GLOBALS!.cookieNames.cameraPosition,
      JSON.stringify(this.UTILS!.camera.getCurrentPosition()), this.GLOBALS!.cookieExpireDefault);
    //Workspace.updateWorkspace(currentWorkspace);
    //this.cookieService.set(ENV.cookieNames.workspace, currentWorkspace.toString(), ENV.cookieExpireDefault);
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

    // TODO Add/remove apps depending on the OS
    this.dashboard = [
      {cols: 3, rows: 5, y: 0, x: 0}, // Layer list
      {cols: 3, rows: 12, y: 5, x: 0}, // Context menu
      {cols: 3, rows: 3, y: 17, x: 0}, // Menu
      {cols: 12, rows: 2, y: 0, x: 3}, // Nav
      {cols: 5, rows: 10, y: 0, x: 15}, // Info
      {cols: 5, rows: 10, y: 10, x: 15}, // View list
      {cols: 12, rows: 2, y: 18, x: 3}, // Status
      {cols: 12, rows: 16, y: 2, x: 3} // Cesium app
    ];
  }
}
