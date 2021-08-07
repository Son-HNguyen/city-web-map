import {ChangeDetectionStrategy, Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType} from "angular-gridster2";
import {UtilityService} from "../utils.service";
import {GlobalService} from "../global.service";
import {GridItemPos} from "../core/Workspace";
import _ = require('lodash');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  private _title = 'city-web-map';
  private _options!: GridsterConfig;
  private _dashboard!: Array<GridsterItem>;
  private _itemPos!: GridItemPos;
  private _changedLayout: string | undefined;

  constructor(
    private cookieService?: CookieService,
    private GLOBALS?: GlobalService,
    private UTILS?: UtilityService) {
    this._changedLayout = undefined;
  }

  @HostListener('document:keydown', ['$event'])
  async onKeyDown(e: KeyboardEvent) {
    if (e.altKey && e.key === 'g') {
      e.preventDefault();
      this.UTILS!.dialog.info('ctrl alt g');
    }
    // Save workspace
    else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      if (e.altKey) {
        // Display options to save
        // TODO Add option to save in cookie, JSON file, URL, pastebin, etc.
        this.UTILS!.dialog.info('Options to save');
      } else {
        // Quick save
        const cookieSize: number = await this.UTILS!.workspace.saveToCookies(this._dashboard);
        this.UTILS!.snackBar.show('Workspace saved (space allocated ' + Math.round(cookieSize / 4096 * 100) + '%)');
      }
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
    await this.UTILS!.workspace.saveToCookies(this._dashboard);
  }

  async ngOnInit() {
    this._options = {
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

    this._dashboard = this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutCenterGlobe.map(x => Object.assign({}, x)); // Deep copy of an array!
    this._itemPos = Object.assign({}, this.GLOBALS!.WORKSPACE.DEFAULT_ITEM_POS_LAYOUTS.layoutCenterGlobe); // Deep copy of an object!

    // Load previous workspace
    await this.UTILS!.workspace.readFromCookies();
    if (this.GLOBALS!.WORKSPACE.gridLayout != null && this.GLOBALS!.WORKSPACE.gridLayout.length !== 0) {
      // If a grid layout already exists in the last/current workspace -> use it
      this._dashboard = this.GLOBALS!.WORKSPACE.gridLayout.map(x => Object.assign({}, x)); // Deep copy of an array!
    }
    if (this.GLOBALS!.WORKSPACE.itemPos != null) {
      // If a grid layout already exists in the last/current workspace -> use it
      this._itemPos = Object.assign({}, this.GLOBALS!.WORKSPACE.itemPos); // Deep copy of an object!
    }
  }

  handleButtonToggleValue(value: any) {
    // TODO Reset a layout when a new layout is selected (to get rid of unwanted changes in the layout)?
    if (this._options.api && this._options.api.optionsChanged) {
      switch (value) {
        case "left": {
          this._dashboard = this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutLeftGlobe.map(x => Object.assign({}, x));
          this._itemPos = Object.assign({}, this.GLOBALS!.WORKSPACE.DEFAULT_ITEM_POS_LAYOUTS.layoutLeftGlobe);
          this._changedLayout = 'left';
          break;
        }
        case "center": {
          this._dashboard = this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutCenterGlobe.map(x => Object.assign({}, x));
          this._itemPos = Object.assign({}, this.GLOBALS!.WORKSPACE.DEFAULT_ITEM_POS_LAYOUTS.layoutCenterGlobe);
          this._changedLayout = 'center';
          break;
        }
        case "right": {
          this._dashboard = this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutRightGlobe.map(x => Object.assign({}, x));
          this._itemPos = Object.assign({}, this.GLOBALS!.WORKSPACE.DEFAULT_ITEM_POS_LAYOUTS.layoutRightGlobe);
          this._changedLayout = 'right';
          break;
        }
      }
      this._options.api.optionsChanged();
    }
  }

  layoutChanged() {
    // Check if the current grid layout is one of the default values
    if (_.isEqual(this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutLeftGlobe, this._dashboard)) {
      this._changedLayout = 'left';
    } else if (_.isEqual(this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutCenterGlobe, this._dashboard)) {
      this._changedLayout = 'center';
    } else if (_.isEqual(this.GLOBALS!.WORKSPACE.DEFAULT_LAYOUTS.layoutRightGlobe, this._dashboard)) {
      this._changedLayout = 'right';
    } else {
      this._changedLayout = undefined;
    }
  }

  get title(): string {
    return this._title;
  }

  get options(): GridsterConfig {
    return this._options;
  }

  get dashboard(): Array<GridsterItem> {
    return this._dashboard;
  }

  get itemPos(): GridItemPos {
    return this._itemPos;
  }

  get changedLayout(): string | undefined {
    return this._changedLayout;
  }
}
