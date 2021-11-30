import {ChangeDetectionStrategy, Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType
} from "angular-gridster2";
import {UtilityService} from "../services/utils.service";
import {GlobalService} from "../services/global.service";
import {GridLayoutType, Workspace} from "../core/Workspace";
import {MatDialog, MatDialogRef, MatDialogState} from "@angular/material/dialog";
import {CheatSheetContentComponent} from "./cheat-sheet/cheat-sheet.component";
import {LogService} from "../services/log.service";
import {DialogReloadPrompt} from "./dialog/dialog.component";

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
  dashboard!: GridLayoutType;
  savedGlobePosition: GridsterItem | undefined;
  fullscreenActive: boolean;

  cheatSheetDialog!: MatDialogRef<CheatSheetContentComponent>;

  workspaceLoaded: boolean;

  // TODO Add option to enter, use, save and import Cesium ion access tokens

  constructor(private GLOBALS?: GlobalService,
              private UTILS?: UtilityService,
              private LOGGER?: LogService,
              private matDialog?: MatDialog) {
    this.savedGlobePosition = undefined;
    this.fullscreenActive = false;
    this.workspaceLoaded = false;
  }

  async initLayout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.dashboard = Object.assign({}, Workspace.DEFAULT_LAYOUT);
      this.fullscreenActive = false;
      resolve();
    });
  }

  // TODO Replace right-click?

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
    } else if (e.ctrlKey) {
      // Open workspace
      if (e.key === 'o') {
        e.preventDefault();
        await this.handleLoad();
        // document.getElementById('buttonLoad')!.click();
      }
      // Save workspace
      else if (e.key === 's') {
        e.preventDefault();
        if (e.altKey) {
          await this.handleSaveAs();
          // document.getElementById('buttonSaveWorkspaceAs')!.click();
        } else {
          await this.handleQuickSave();
          // document.getElementById('buttonQuickSaveWorkspace')!.click();
        }
      } else if (e.altKey) {
        // Toggle between light and dark mode
        if (e.key === 'd') {
          e.preventDefault();
          document.getElementById('toggleSwitchTheme')!.dispatchEvent(new Event('change'));
        }
        // Select imagery (base) layer
        else if (e.key === 'i') {
          e.preventDefault();
          document.getElementById('buttonImageryLayerPicker')!.click();
        }
        // Fly to default location
        else if (e.key === 'h') {
          e.preventDefault();
          document.getElementById('buttonFlyHome')!.click();
        }
        // New workspace
        else if (e.key === 'n') {
          e.preventDefault();
          await this.handleNew();
          // document.getElementById('buttonNewWorkspace')!.click();
        }
        // Export workspace to file
        else if (e.key === 'x') {
          e.preventDefault();
          await this.handleQuickExport();
          // document.getElementById('buttonQuickExport')!.click();
        }
      }
    }

    // TODO Save input texts as suggestions while typing?
  }

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event: any) {
    await this.handleQuickSave();
    // document.getElementById('buttonQuickSaveWorkspace')!.click();
  }

  async ngOnInit() {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.None,
      compactType: CompactType.None,
      maxCols: 20,
      maxRows: 20,
      pushItems: true,
      pushResizeItems: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true,
      }
    };

    // TODO Add/remove apps depending on the OS

    await this.initLayout();

    await this.loadLayoutFromSavedWorkspace();

    // Check if fullscreen is activated
    await this.handleFullscreen(this.fullscreenActive);
  }

  private async loadLayoutFromSavedWorkspace(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.GLOBALS!.WORKSPACE.gridLayout != null) {
        // If a grid layout already exists in the last/current workspace -> use it
        this.dashboard = Object.assign({}, this.GLOBALS!.WORKSPACE.gridLayout);
      }
      this.fullscreenActive = this.GLOBALS!.WORKSPACE.fullscreenActive;
      resolve();
    });
  }

  handleSwitchTheme(useDarkTheme: boolean) {
    this.GLOBALS!.WORKSPACE.darkTheme = useDarkTheme;
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDropSuccess(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer != null && event.dataTransfer.files != null && event.dataTransfer.files.length > 0) {
      this.loadExternalFile(event.dataTransfer.files[0]);
    }
  }

  private loadExternalFile(file: File, noDialog?: boolean) {
    let fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const parsedWorkspace = fileReader.result;
      if (parsedWorkspace == null) {
        return;
      }
      try {
        const parsedWorkspaceObj = <Workspace><unknown>parsedWorkspace;
        await (this.loadWorkspace(parsedWorkspaceObj, noDialog));
      } catch (e) {
        this.LOGGER!.warn('No valid workspace found from input file');
      }
    }
    fileReader.readAsText(file);
  }

  private async loadWorkspace(workspace: Workspace, noDialog?: boolean) {
    if (noDialog != null && noDialog) {
      // Called by load function, no need to ask user for reloading
      this.reloadWorkspace(workspace);
    } else {
      const confirmReload = await this.UTILS!.dialog.reload();
      switch (confirmReload) {
        case DialogReloadPrompt.SAVE_THEN_RELOAD:
          // Save current workspace
          await this.handleQuickExport();
          // document.getElementById('buttonQuickExportWorkspace')!.click();
          await new Promise(f => {
            setTimeout(f, 1000);
          });
          // TODO Display save dialog
          // Then reload
          this.reloadWorkspace(workspace);
          break;
        case DialogReloadPrompt.IGNORE_AND_RELOAD:
          this.reloadWorkspace(workspace);
          break;
      }
    }
  }

  private reloadWorkspace(parsedWorkspaceObj: Workspace) {
    //this.UTILS!.snackBar.show('Valid workspace found, reloading...');
    this.workspaceLoaded = true;
    this.GLOBALS!.WORKSPACE = parsedWorkspaceObj;
    location.reload();
  }

  async handleLoad() {
    const file = await this.UTILS!.dialog.load();
    if (file != null) {
      this.loadExternalFile(file, true);
    }
  }

  async handleQuickSave() {
    // TODO Save in local storage for bigger workspace?
    // TODO Compress bigger JSON objects? -> jspack
    // TODO QR code for sharing (small) workspaces?
    // TODO Add option to login to save settings and set custom share URLs? -> passportjs
    // Quick save
    let storedSize: number;
    if (this.workspaceLoaded) {
      // A new valid workspace (such as from external file, or triggered by reset) found
      storedSize = await this.UTILS!.workspace.saveToLocalStorage();
    } else {
      // Check if fullscreen is activated
      if (this.fullscreenActive && this.savedGlobePosition != null) {
        let tmpDashboard = Object.assign({}, this.dashboard);
        tmpDashboard.globe.layout.x = this.savedGlobePosition.x;
        tmpDashboard.globe.layout.y = this.savedGlobePosition.y;
        tmpDashboard.globe.layout.cols = this.savedGlobePosition.cols;
        tmpDashboard.globe.layout.rows = this.savedGlobePosition.rows;
        storedSize = await this.UTILS!.workspace.saveToLocalStorage(tmpDashboard, this.fullscreenActive);
      } else {
        storedSize = await this.UTILS!.workspace.saveToLocalStorage(this.dashboard, this.fullscreenActive);
      }
    }
    this.UTILS!.snackBar.show('Workspace saved (space allocated ' +
      Math.round(storedSize / 1024 * 1000) / 1000 + 'KB).');
  }

  async handleQuickExport(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // TODO Option for users to enter filename in `Save as...`?
      // Save first
      await this.handleQuickSave();
      // Then write the saved workspace
      await this.UTILS!.workspace.saveToFile(Workspace.DEFAULT_WORKSPACE_FILENAME);
      this.UTILS!.snackBar.show('Workspace exported. Drag and drop this file onto the web client to load.',
        {
          horizontalPosition: 'left',
          verticalPosition: 'bottom'
        });
      resolve();
    });
  }

  async handleSaveAs() {
    // Display options to save
    // TODO Add option to save in JSON file, URL, pastebin, etc.
    // TODO Here show in a modal window what is going to be saved and the user can choose/change
    this.UTILS!.dialog.info('Options to save');
  }

  async handleNew() {
    await this.loadWorkspace(new Workspace({}));
  }

  layoutChanged(event: { item: GridsterItem, itemComponent: GridsterItemComponentInterface }, index: number) {
    let menuBar = this.dashboard.menuBar.layout;
    let workspaceView = this.dashboard.workspaceView.layout;
    let detailView = this.dashboard.detailView.layout;
    let infoView = this.dashboard.infoView.layout;
    let statusView = this.dashboard.statusView.layout;
    let globe = this.dashboard.globe.layout;
    const maxCols = this.options.maxCols!;
    const maxRows = this.options.maxRows!;

    if (this.options.api != null && this.options.api.optionsChanged != null) {
      switch (index) {
        case 0:
          // Menu bar
          break;
        case 1:
          // Workspace view
          // Cols
          detailView.cols = workspaceView.cols;
          globe.cols = maxCols - infoView.cols - workspaceView.cols;
          // Rows
          detailView.rows = maxRows - menuBar.rows - workspaceView.rows - statusView.rows;
          // Position
          globe.x = workspaceView.x + workspaceView.cols;
          detailView.y = menuBar.rows + workspaceView.rows;
          break;
        case 2:
          // Detail view
          // Cols
          workspaceView.cols = detailView.cols;
          globe.cols = maxCols - infoView.cols - detailView.cols;
          // Rows
          workspaceView.rows = maxRows - menuBar.rows - detailView.rows - statusView.rows;
          // Position
          globe.x = detailView.x + detailView.cols;
          break;
        case 3:
          // Info view
          // Cols
          globe.cols = maxCols - workspaceView.cols - infoView.cols;
          break;
        case 4:
          // Status view
          break;
        case 5:
          // Globe
          // Cols
          if (globe.x !== workspaceView.x + workspaceView.cols) {
            // Left side has been resized
            workspaceView.cols = globe.x;
            detailView.cols = globe.x;
          } else if (globe.x + globe.cols !== infoView.x) {
            // Right side has been resized
            infoView.x = globe.x + globe.cols;
            infoView.cols = maxCols - workspaceView.cols - globe.cols;
          }
          break;
      }

      this.options.api.optionsChanged();
    }
  }

  async handleFullscreen(fullscreenActive: boolean) {
    this.fullscreenActive = fullscreenActive;

    await this.activateFullscreen();

    if (this.fullscreenActive) {
      // TODO Add enums / static const for changeable hotkeys?
      this.UTILS!.snackBar.show('Press F11 to exit fullscreen.');
    }
  }

  private async activateFullscreen(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      if (this.options && this.options.api && this.options.api.optionsChanged) {
        if (this.fullscreenActive) {
          // Save current layout
          this.savedGlobePosition = {
            x: this.dashboard.globe.layout.x,
            y: this.dashboard.globe.layout.y,
            cols: this.dashboard.globe.layout.cols,
            rows: this.dashboard.globe.layout.rows
          };
          // Activate fullscreen
          this.dashboard.globe.layout.x = 0;
          this.dashboard.globe.layout.y = 0;
          this.dashboard.globe.layout.cols = this.dashboard.globe.layout.maxItemCols!;
          this.dashboard.globe.layout.rows = this.dashboard.globe.layout.maxItemRows!;
        } else if (this.savedGlobePosition != null) {
          // Restore saved layout
          this.dashboard.globe.layout.x = this.savedGlobePosition.x;
          this.dashboard.globe.layout.y = this.savedGlobePosition.y;
          this.dashboard.globe.layout.cols = this.savedGlobePosition.cols;
          this.dashboard.globe.layout.rows = this.savedGlobePosition.rows;
        }
        await this.options.api.optionsChanged();
        resolve();
      }
    });
  }
}
