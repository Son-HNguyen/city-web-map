import {ChangeDetectionStrategy, Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType} from "angular-gridster2";
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
  layouts: GridLayouts;
  itemPosLayouts: GridItemPositions;
  options!: GridsterConfig;
  dashboard!: Array<GridsterItem>;
  itemPos: GridItemPos | undefined;

  constructor(
    private cookieService?: CookieService,
    private GLOBALS?: GlobalService,
    private UTILS?: UtilityService) {
    this.layouts = {
      layoutLeftGlobe: [
        {cols: 20, rows: 1, y: 0, x: 0}, // Menu bar
        {cols: 12, rows: 2, y: 1, x: 0}, // Nav
        {cols: 12, rows: 2, y: 19, x: 0}, // Status
        {cols: 5, rows: 10, y: 1, x: 12}, // Info
        {cols: 5, rows: 10, y: 11, x: 12}, // View list
        {cols: 3, rows: 5, y: 1, x: 17}, // Layer list
        {cols: 3, rows: 12, y: 6, x: 17}, // Context menu
        {cols: 3, rows: 3, y: 18, x: 17}, // Menu
        {cols: 12, rows: 16, y: 3, x: 0} // Cesium app
      ],
      layoutCenterGlobe: [
        {cols: 20, rows: 1, y: 0, x: 0}, // Menu bar
        {cols: 3, rows: 5, y: 1, x: 0}, // Layer list
        {cols: 3, rows: 12, y: 6, x: 0}, // Context menu
        {cols: 3, rows: 3, y: 18, x: 0}, // Menu
        {cols: 12, rows: 2, y: 1, x: 3}, // Nav
        {cols: 5, rows: 10, y: 1, x: 15}, // Info
        {cols: 5, rows: 10, y: 11, x: 15}, // View list
        {cols: 12, rows: 2, y: 19, x: 3}, // Status
        {cols: 12, rows: 16, y: 3, x: 3} // Cesium app
      ],
      layoutRightGlobe: [
        {cols: 20, rows: 1, y: 0, x: 0}, // Menu bar
        {cols: 3, rows: 5, y: 1, x: 0}, // Layer list
        {cols: 3, rows: 12, y: 6, x: 0}, // Context menu
        {cols: 3, rows: 3, y: 18, x: 0}, // Menu
        {cols: 5, rows: 10, y: 1, x: 3}, // Info
        {cols: 5, rows: 10, y: 11, x: 3}, // View list
        {cols: 12, rows: 2, y: 1, x: 8}, // Nav
        {cols: 12, rows: 2, y: 19, x: 8}, // Status
        {cols: 12, rows: 16, y: 3, x: 8} // Cesium app
      ]
    };
    this.itemPosLayouts = {
      layoutLeftGlobe: {
        menuBar: 0,
        nav: 1,
        status: 2,
        info: 3,
        viewList: 4,
        layerList: 5,
        menuContext: 6,
        menu: 7,
        globe: 8
      },
      layoutCenterGlobe: {
        menuBar: 0,
        layerList: 1,
        menuContext: 2,
        menu: 3,
        nav: 4,
        info: 5,
        viewList: 6,
        status: 7,
        globe: 8
      },
      layoutRightGlobe: {
        menuBar: 0,
        layerList: 1,
        menuContext: 2,
        menu: 3,
        info: 4,
        viewList: 5,
        nav: 6,
        status: 7,
        globe: 8
      }
    };
  }

  @HostListener('document:keydown', ['$event']) async onKeyDown(e: KeyboardEvent) {
    if (e.altKey && e.key === 'g') {
      e.preventDefault();
      this.UTILS!.dialog.info('ctrl alt g');
    }
    // Save workspace
    else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      // TODO Add option to save in cookie, JSON file, URL, pastebin, etc.
      await this.UTILS!.workspace.saveToCookies();
      this.UTILS!.snackBar.show('Workspace saved');
    }
    // Open workspace
    else if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      this.UTILS!.dialog.info('Open workspace');
    }
    // New workspace
    else if (e.ctrlKey && e.altKey && e.key === 'n') {
      e.preventDefault();
      this.UTILS!.dialog.info('New workspace');
    }
    // Cheat sheet
    else if (e.ctrlKey && e.key === 'F1') {
      e.preventDefault();
      document.getElementById("buttonOpenCheatSheet")!.click();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event: any) {
    await this.UTILS!.workspace.saveToCookies();
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.None,
      compactType: CompactType.None,
      maxCols: 20,
      maxRows: 21,
      pushItems: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
    };

    // TODO Add/remove apps depending on the OS
    this.dashboard = this.layouts.layoutCenterGlobe.map(x => Object.assign({}, x)); // deep copy of an array!
    this.itemPos = Object.assign({}, this.itemPosLayouts.layoutCenterGlobe); // deep copy of an object!
  }

  changeGridLayout(value: any) {
    // TODO Reset a layout when a new layout is selected (to get rid of unwanted changes in the layout)?
    if (this.options.api && this.options.api.optionsChanged) {
      switch (value) {
        case "left": {
          this.dashboard = this.layouts.layoutLeftGlobe.map(x => Object.assign({}, x));
          this.itemPos = Object.assign({}, this.itemPosLayouts.layoutLeftGlobe);
          break;
        }
        case "center": {
          this.dashboard = this.layouts.layoutCenterGlobe.map(x => Object.assign({}, x));
          console.log(this.layouts.layoutCenterGlobe);
          this.itemPos = Object.assign({}, this.itemPosLayouts.layoutCenterGlobe);
          break;
        }
        case "right": {
          this.dashboard = this.layouts.layoutRightGlobe.map(x => Object.assign({}, x));
          this.itemPos = Object.assign({}, this.itemPosLayouts.layoutRightGlobe);
          break;
        }
      }
      this.options.api.optionsChanged();
    }
  }
}

interface GridLayouts {
  layoutLeftGlobe: Array<GridsterItem>,
  layoutCenterGlobe: Array<GridsterItem>,
  layoutRightGlobe: Array<GridsterItem>
}

interface GridItemPositions {
  layoutLeftGlobe: GridItemPos,
  layoutCenterGlobe: GridItemPos,
  layoutRightGlobe: GridItemPos
}

interface GridItemPos {
  menuBar: number,
  layerList: number,
  menuContext: number,
  menu: number,
  nav: number,
  info: number,
  viewList: number,
  status: number,
  globe: number
}
