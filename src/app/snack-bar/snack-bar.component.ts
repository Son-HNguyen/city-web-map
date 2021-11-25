import {Component, Inject} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef, MatSnackBarVerticalPosition
} from "@angular/material/snack-bar";
import {LogService} from "../../services/log.service";

export interface SnackbarData {
  message: string;
}

@Component({
  selector: 'app-snack-bar',
  templateUrl: 'snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent {
  static snackBar: MatSnackBar;
  static duration = 3000;
  static horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  static verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(snackBar: MatSnackBar) {
    SnackBarComponent.snackBar = snackBar;
  }
}

@Component({
  templateUrl: 'snack-bar.content.component.html'
})
export class SnackBarContentComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarContentComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    public logger: LogService) {
    this.logger.info(this.data.message);
  }
}
