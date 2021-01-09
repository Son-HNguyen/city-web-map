/*
 * City Web Map
 * http://www.3dcitydb.org/
 *
 * Copyright 2015 - 2021
 * Chair of Geoinformatics
 * Department of Aerospace and Geodesy
 * Technical University of Munich, Germany
 * https://www.gis.lrg.tum.de/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, Inject} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {LogService} from "../log/log.service";

/**
 * Information dialog
 */

export interface DialogInfoData {
  message: string;
}

@Component({
  selector: "app-dialog",
  templateUrl: "dialog.button.html"
})
export class DialogInfoFunction {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogInfoFunction.dialog = dialog;
  }
}

@Component({
  templateUrl: "dialog.info.content.html"
})
export class DialogInfoContent {
  constructor(
    public dialogRef: MatDialogRef<DialogInfoContent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogInfoData,
    public logger: LogService) {
    this.logger.info(this.data.message);
  }

  onClick(): void {
    this.dialogRef.close();
  }
}

/**
 * Confirmation dialog
 */

export interface DialogConfirmData extends DialogInfoData {
  confirmed: boolean;
}

@Component({
  selector: "app-dialog",
  templateUrl: "dialog.button.html"
})
export class DialogConfirmFunction {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogConfirmFunction.dialog = dialog;
  }
}

@Component({
  templateUrl: "dialog.confirm.content.html"
})
export class DialogConfirmContent {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmContent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,
    public logger: LogService) {
    this.logger.info(this.data.message);
  }

  onNoClick(): void {
    this.data.confirmed = false;
    this.onClick();
  }

  onYesClick(): void {
    this.data.confirmed = true;
    this.onClick();
  }

  private onClick(): void {
    this.logger.debug("User's confirmation: " + this.data.confirmed);
    this.dialogRef.close();
  }
}

/**
 * Warning dialog
 */

export interface DialogWarningData extends DialogInfoData {
}

@Component({
  selector: "app-dialog",
  templateUrl: "dialog.button.html"
})
export class DialogWarningFunction {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogWarningFunction.dialog = dialog;
  }
}

@Component({
  templateUrl: "dialog.warning.content.html"
})
export class DialogWarningContent {
  constructor(
    public dialogRef: MatDialogRef<DialogWarningContent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogWarningData,
    public logger: LogService) {
    this.logger.warn(this.data.message);
  }

  onClick(): void {
    this.dialogRef.close();
  }
}

/**
 * Error dialog
 */

export interface DialogErrorData extends DialogInfoData {
}

@Component({
  selector: "app-dialog",
  templateUrl: "dialog.button.html"
})
export class DialogErrorFunction {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogErrorFunction.dialog = dialog;
  }
}

@Component({
  templateUrl: "dialog.error.content.html"
})
export class DialogErrorContent {
  constructor(
    public dialogRef: MatDialogRef<DialogErrorContent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogErrorData,
    public logger: LogService) {
    this.logger.error(this.data.message);
  }

  onClick(): void {
    this.dialogRef.close();
  }
}
