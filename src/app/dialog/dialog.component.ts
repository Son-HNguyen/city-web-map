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

import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {LogService} from '../log/log.service';

/**
 * Information dialog
 */

export interface DialogInfoData {
  message: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogInfoComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogInfoComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.info.content.component.html'
})
export class DialogInfoContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogInfoContentComponent>,
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
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogConfirmComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogConfirmComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.confirm.content.component.html'
})
export class DialogConfirmContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmContentComponent>,
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
    this.logger.debug('User\'s confirmation: ' + this.data.confirmed);
    this.dialogRef.close();
  }
}

/**
 * Warning dialog
 */

export type DialogWarningData = DialogInfoData;

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogWarningComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogWarningComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.warning.content.component.html'
})
export class DialogWarningContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogWarningContentComponent>,
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

export type DialogErrorData = DialogInfoData;

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogErrorComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogErrorComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.error.content.component.html'
})
export class DialogErrorContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogErrorContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogErrorData,
    public logger: LogService) {
    this.logger.error(this.data.message);
  }

  onClick(): void {
    this.dialogRef.close();
  }
}
