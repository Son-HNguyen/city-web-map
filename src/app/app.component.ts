import {ChangeDetectionStrategy, Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType} from "angular-gridster2";
import {UtilityService} from "../utils.service";
import {GlobalService} from "../global.service";
import {GridItemPos, Workspace} from "../core/Workspace";

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
  itemPos!: GridItemPos;
  changedLayout: string | undefined;
  savedDashboard!: Array<GridsterItem>;
  savedItemPos!: GridItemPos;

  constructor(
    private cookieService?: CookieService,
    private GLOBALS?: GlobalService,
    private UTILS?: UtilityService) {
    this.changedLayout = undefined;
  }

  // TODO Pressing the hotkeys again automatically closes the dialog
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
        const cookieSize: number = await this.UTILS!.workspace.saveToCookies(this.dashboard);
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
    else if (e.key === 'F1') {
      e.preventDefault();
      document.getElementById("buttonOpenCheatSheet")!.click();
    }
    // Fullscreen
    else if (e.key === 'F11') {
      e.preventDefault();
      document.getElementById("buttonFullscreen")!.click();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event: any) {
    await this.UTILS!.workspace.saveToCookies(this.dashboard);
  }

  async ngOnInit() {
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

    this.dashboard = Workspace.DEFAULT_LAYOUTS.layoutCenterGlobe.map(x => Object.assign({}, x)); // Deep copy of an array!
    this.itemPos = Object.assign({}, Workspace.DEFAULT_ITEM_POS_LAYOUTS.layoutCenterGlobe); // Deep copy of an object!

    // Load previous workspace
    await this.UTILS!.workspace.readFromCookies();
    if (this.GLOBALS!.WORKSPACE.gridLayout != null && this.GLOBALS!.WORKSPACE.gridLayout.length !== 0) {
      // If a grid layout already exists in the last/current workspace -> use it
      this.dashboard = this.GLOBALS!.WORKSPACE.gridLayout.map(x => Object.assign({}, x)); // Deep copy of an array!
    }
    if (this.GLOBALS!.WORKSPACE.itemPos != null) {
      // If a grid layout already exists in the last/current workspace -> use it
      this.itemPos = Object.assign({}, this.GLOBALS!.WORKSPACE.itemPos); // Deep copy of an object!
    }
  }

  handleButtonToggleValue(value: any) {
    // TODO Reset a layout when a new layout is selected (to get rid of unwanted changes in the layout)?
    if (this.options.api && this.options.api.optionsChanged) {
      switch (value) {
        case "left": {
          this.dashboard = Workspace.DEFAULT_LAYOUTS.layoutLeftGlobe.map(x => Object.assign({}, x));
          this.itemPos = Object.assign({}, Workspace.DEFAULT_ITEM_POS_LAYOUTS.layoutLeftGlobe);
          this.changedLayout = 'left';
          break;
        }
        case "center": {
          this.dashboard = Workspace.DEFAULT_LAYOUTS.layoutCenterGlobe.map(x => Object.assign({}, x));
          this.itemPos = Object.assign({}, Workspace.DEFAULT_ITEM_POS_LAYOUTS.layoutCenterGlobe);
          this.changedLayout = 'center';
          break;
        }
        case "right": {
          this.dashboard = Workspace.DEFAULT_LAYOUTS.layoutRightGlobe.map(x => Object.assign({}, x));
          this.itemPos = Object.assign({}, Workspace.DEFAULT_ITEM_POS_LAYOUTS.layoutRightGlobe);
          this.changedLayout = 'right';
          break;
        }
      }
      this.options.api.optionsChanged();
    }
  }

  layoutChanged() {
    // Check if the current grid layout is one of the default values
    this.changedLayout = Workspace.getLayout(this.dashboard);
  }

  handleFullscreen(fullscreenActive: boolean) {
    if (this.options && this.options.api && this.options.api.optionsChanged) {
      if (fullscreenActive) {
        // Save current layout
        this.savedDashboard = this.dashboard.map(x => Object.assign({}, x));
        // Activate fullscreen
        this.dashboard = Workspace.DEFAULT_LAYOUTS.layoutFullscreen.map(x => Object.assign({}, x));
      } else {
        // Restore saved layout
        this.dashboard = this.savedDashboard.map(x => Object.assign({}, x));
      }
      this.options.api.optionsChanged();
    }
  }
}
