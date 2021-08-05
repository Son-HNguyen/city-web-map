import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LogService} from "../log/log.service";

@Component({
  selector: 'app-cheat-sheet',
  templateUrl: './cheat-sheet.component.html',
  styleUrls: ['./cheat-sheet.component.css']
})
export class CheatSheetComponent {
  static opened: boolean = false;

  constructor(
    public dialog: MatDialog,
    public logger: LogService) {
  }

  openCheatSheet() {
    if (!CheatSheetComponent.opened) {
      const dialogRef = this.dialog.open(CheatSheetContentComponent);
      CheatSheetComponent.opened = true;

      dialogRef.afterClosed().subscribe(result => {
        CheatSheetComponent.opened = false;
        // TODO Enable changing hotkeys and saving in workspace
        this.logger.info(`Save changed hotkeys? ${result}`);
        if (`${result}`) {
          // TODO Save changed configs
        } else {
          // TODO Reset to default settings
        }
      });
    }
  }
}

@Component({
  selector: 'app-cheat-sheet-content',
  templateUrl: './cheat-sheet-content.component.html',
  styleUrls: ['./cheat-sheet-content.component.css']
})
export class CheatSheetContentComponent {
  constructor() {
  }
}
