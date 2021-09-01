import {ChangeDetectionStrategy, Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType} from "angular-gridster2";
import {UtilityService} from "../utils.service";
import {GlobalService} from "../global.service";
import {GridItemPos, Workspace} from "../core/Workspace";
import {MatDialog, MatDialogRef, MatDialogState} from "@angular/material/dialog";
import {CheatSheetContentComponent} from "./cheat-sheet/cheat-sheet.component";
import {DialogSearchContentComponent} from "./dialog/dialog.component";

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
  savedDashboard: Array<GridsterItem> | undefined;
  savedItemPos: GridItemPos | undefined;
  fullscreenActive: boolean;

  cheatSheetDialog!: MatDialogRef<CheatSheetContentComponent>;
  searchDialog!: MatDialogRef<DialogSearchContentComponent>;

  // TODO Add option to enter, use, save and import Cesium ion access tokens

  constructor(
    private cookieService?: CookieService,
    private GLOBALS?: GlobalService,
    private UTILS?: UtilityService,
    private matDialog?: MatDialog) {
    this.changedLayout = undefined;
    this.savedDashboard = undefined;
    this.savedItemPos = undefined;
    this.fullscreenActive = false;
  }

  async initLayout(): Promise<void> {
    const scope = this;
    return new Promise<void>((resolve, reject) => {
      scope.dashboard = Workspace.DEFAULT_LAYOUTS.layoutCenterGlobe.map(x => Object.assign({}, x)); // Deep copy of an array!
      scope.itemPos = Object.assign({}, Workspace.DEFAULT_ITEM_POS_LAYOUTS.layoutCenterGlobe); // Deep copy of an object!
      this.fullscreenActive = false;
      resolve();
    });
  }

  // TODO Show hotkeys in all tooltips e.g. `Tooltip | Fn`
  // TODO Pressing the hotkeys again automatically closes the dialog
  @HostListener('document:keydown', ['$event'])
  async onKeyDown(e: KeyboardEvent) {
    // Cheat sheet
    if (e.key === 'F1') {
      e.preventDefault();
      if (this.cheatSheetDialog != null && this.cheatSheetDialog.getState() === MatDialogState.OPEN) {
        this.cheatSheetDialog.close();
      } else {
        this.cheatSheetDialog = this.matDialog!.open(CheatSheetContentComponent);
        // document.getElementById("buttonOpenCheatSheet")!.click();
      }
    }

    // Search location
    else if (e.key === 'F3') {
      e.preventDefault();
      document.getElementById("buttonSearch")!.click();
    }

    // Fullscreen
    else if (e.key === 'F11') {
      e.preventDefault();
      document.getElementById("buttonFullscreen")!.click();
    }

    // Save workspace
    else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      if (e.altKey) {
        await this.handleSaveAs();
        // document.getElementById('buttonSaveWorkspaceAs')!.click();
      } else {
        await this.handleQuickSave();
        // document.getElementById('buttonQuickSaveWorkspace')!.click();
      }
    } else if (e.ctrlKey && e.altKey && e.key === 'e') {
      e.preventDefault();
      await this.handleQuickExport();
      // document.getElementById('buttonQuickExport')!.click();
    }

    // Open workspace
    else if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      this.UTILS!.dialog.info('Open workspace');
    }

    // New workspace
    else if (e.ctrlKey && e.altKey && e.key === 'n') {
      e.preventDefault();
      await this.handleNew();
      // document.getElementById('buttonNewWorkspace')!.click();
    }

    // Fly to default location
    else if (e.ctrlKey && e.altKey && e.key === 'h') {
      e.preventDefault();
      document.getElementById('buttonFlyHome')!.click();
    }

    // TODO F3 for searching geocoder (Cesium ion by default, Nominatim without autocomplete as alternative)
    // TODO Support for addresses, location names, postal codes, etc.
    // TODO Save input texts as suggestions while typing?
    // TODO Use a bib to look up location names and postal codes instead of Cesium ion?
  }

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event: any) {
    document.getElementById('buttonQuickSaveWorkspace')!.click();
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

    await this.initLayout();

    const scope = this;

    async function loadSavedWorkspace(): Promise<void> {
      const nestedScope = scope;
      return new Promise<void>((resolve, reject) => {
        if (nestedScope.GLOBALS!.WORKSPACE.gridLayout != null && nestedScope.GLOBALS!.WORKSPACE.gridLayout.length !== 0) {
          // If a grid layout already exists in the last/current workspace -> use it
          nestedScope.dashboard = nestedScope.GLOBALS!.WORKSPACE.gridLayout.map(x => Object.assign({}, x)); // Deep copy of an array!
        }
        if (nestedScope.GLOBALS!.WORKSPACE.itemPos != null) {
          // If a grid layout already exists in the last/current workspace -> use it
          nestedScope.itemPos = Object.assign({}, nestedScope.GLOBALS!.WORKSPACE.itemPos); // Deep copy of an object!
        }
        nestedScope.fullscreenActive = nestedScope.GLOBALS!.WORKSPACE.fullscreenActive;
        resolve();
      });
    }

    await loadSavedWorkspace();

    // Check if fullscreen is activated
    await this.handleFullscreen(this.fullscreenActive);
  }

  async handleQuickSave() {
    // TODO Save in local storage for bigger workspace?
    // TODO Compress bigger JSON objects? -> jspack
    // TODO QR code for sharing (small) workspaces?
    // TODO Add option to login to save settings and set custom share URLs? -> passportjs
    // Quick save
    let cookieSize: number;
    // Check if fullscreen is activated
    if (this.fullscreenActive && this.savedDashboard != null) {
      cookieSize = await this.UTILS!.workspace.saveToCookies(this.savedDashboard, this.fullscreenActive);
    } else {
      cookieSize = await this.UTILS!.workspace.saveToCookies(this.dashboard, this.fullscreenActive);
    }
    this.UTILS!.snackBar.show('Workspace saved (space allocated ' + Math.round(cookieSize / 4096 * 100) + '%).');
  }

  async handleQuickExport() {
    await this.UTILS!.workspace.saveToFile(this.dashboard, this.fullscreenActive);
    this.UTILS!.snackBar.show('Workspace exported. Drag and drop this file onto the web client to load.',
      {
        horizontalPosition: 'left',
        verticalPosition: 'bottom'
      });
  }

  async handleSaveAs() {
    // Display options to save
    // TODO Add option to save in cookie, JSON file, URL, pastebin, etc.
    // TODO Here show in a modal window what is going to be saved and the user can choose/change
    this.UTILS!.dialog.info('Options to save');
  }

  async handleNew() {
    // TODO Ask if the current workspace needs to be saved first before a new one is created
    const scope = this;

    async function createNewWorkspace(): Promise<void> {
      const nestedScope = scope;
      return new Promise<void>(async (resolve, reject) => {
        if (nestedScope.options && nestedScope.options.api && nestedScope.options.api.optionsChanged) {
          nestedScope.GLOBALS!.WORKSPACE = new Workspace();

          // TODO Apply new workspace to widgets (timeline, etc.)

          // Reset timeline
          document.getElementById('buttonResetTimeline')!.click();

          await nestedScope.initLayout();
          await nestedScope.options.api.optionsChanged();
          resolve();
        }
      });
    }

    await createNewWorkspace();

    await this.UTILS!.camera.flyToPosition(this.GLOBALS!.WORKSPACE.cameraLocation);

    this.layoutChanged();

    this.UTILS!.snackBar.show('A new workspace has been created.');
  }

  async handleToggleValue(value: any) {
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
      await this.options.api.optionsChanged();
    }
  }

  layoutChanged() {
    // Check if the current grid layout is one of the default values
    this.changedLayout = Workspace.getLayout(this.dashboard);
  }

  async handleFullscreen(fullscreenActive: boolean) {
    this.fullscreenActive = fullscreenActive;

    const scope = this;

    async function activateFullscreen(): Promise<void> {
      const nestedScope = scope;
      return new Promise<void>(async (resolve, reject) => {
        if (nestedScope.options && nestedScope.options.api && nestedScope.options.api.optionsChanged) {
          if (nestedScope.fullscreenActive) {
            // Save current layout
            nestedScope.savedDashboard = nestedScope.dashboard.map(x => Object.assign({}, x));
            // Activate fullscreen
            nestedScope.dashboard = Workspace.DEFAULT_LAYOUTS.layoutFullscreen.map(x => Object.assign({}, x));
          } else if (nestedScope.savedDashboard != null) {
            // Restore saved layout
            nestedScope.dashboard = nestedScope.savedDashboard.map(x => Object.assign({}, x));
          }
          await nestedScope.options.api.optionsChanged();
          resolve();
        }
      });
    }

    await activateFullscreen();

    if (this.fullscreenActive) {
      // TODO Add enums / static const for changeable hotkeys?
      this.UTILS!.snackBar.show('Press F11 to exit fullscreen.');
    }
  }
}
