/*
 *
 *  * City Web Map
 *  * http://www.3dcitydb.org/
 *  *
 *  * Copyright 2015 - 2021
 *  * Chair of Geoinformatics
 *  * Department of Aerospace and Geodesy
 *  * Technical University of Munich, Germany
 *  * https://www.gis.lrg.tum.de/
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

import {
  DialogConfirmComponent,
  DialogConfirmContentComponent,
  DialogErrorContentComponent,
  DialogInfoComponent,
  DialogInfoContentComponent,
  DialogLoadComponent,
  DialogLoadContentComponent,
  DialogReloadComponent,
  DialogReloadContentComponent,
  DialogReloadPrompt,
  DialogSearchComponent,
  DialogSearchContentComponent,
  DialogWarningComponent,
  DialogWarningContentComponent
} from '../app/dialog/dialog.component';
import {MatDialogRef, MatDialogState} from "@angular/material/dialog";

export class DialogUtility {
  infoDialogRef: MatDialogRef<DialogInfoContentComponent> | undefined;
  errorDialogRef: MatDialogRef<DialogErrorContentComponent> | undefined;
  warnDialogRef: MatDialogRef<DialogWarningContentComponent> | undefined;
  confirmDialogRef: MatDialogRef<DialogConfirmContentComponent> | undefined;
  searchDialogRef: MatDialogRef<DialogSearchContentComponent> | undefined;
  reloadDialogRef: MatDialogRef<DialogReloadContentComponent> | undefined;
  loadDialogRef: MatDialogRef<DialogLoadContentComponent> | undefined;

  constructor() {
  }

  /**
   * Open/Close an info pop-up with given content.
   */
  public info(content: string): void {
    if (this.infoDialogRef == null || this.infoDialogRef.getState() === MatDialogState.CLOSED) {
      this.infoDialogRef = DialogInfoComponent.dialog.open(DialogInfoContentComponent, {
        data: {
          message: content
        }
      });
    } else {
      this.infoDialogRef.close();
    }
  }

  /**
   * Open/Close an error pop-up with given content.
   */
  public error(content: string): void {
    if (this.errorDialogRef == null || this.errorDialogRef.getState() === MatDialogState.CLOSED) {
      this.errorDialogRef = DialogWarningComponent.dialog.open(DialogErrorContentComponent, {
        data: {
          message: content
        }
      });
    } else {
      this.errorDialogRef.close();
    }
  }

  /**
   * Open a warning pop-up with given content.
   */
  public warn(content: string): void {
    if (this.warnDialogRef == null || this.warnDialogRef.getState() === MatDialogState.CLOSED) {
      this.warnDialogRef = DialogWarningComponent.dialog.open(DialogWarningContentComponent, {
        data: {
          message: content
        }
      });
    } else {
      this.warnDialogRef.close();
    }
  }

  /**
   * Open a dialog pop-up and ask for confirmation.
   */
  public confirm(content: string): boolean {
    if (this.confirmDialogRef == null || this.confirmDialogRef.getState() === MatDialogState.CLOSED) {
      this.confirmDialogRef = DialogConfirmComponent.dialog.open(DialogConfirmContentComponent, {
        data: {
          message: content
        }
      });

      let confirmed = false;
      this.confirmDialogRef.afterClosed().subscribe(result => {
        confirmed = this.confirmDialogRef!.componentInstance.data.confirmed;
      });

      return confirmed;
    }

    this.confirmDialogRef.close();
    return false;
  }

  /**
   * Open/Close a dialog for searching locations.
   */
  public search() {
    if (this.searchDialogRef == null || this.searchDialogRef.getState() === MatDialogState.CLOSED) {
      this.searchDialogRef = DialogSearchComponent.dialog.open(DialogSearchContentComponent, {
        data: {}
      });
      return;
    }

    this.searchDialogRef.close();
    let search: string = '';
    let confirmed = false;
    this.searchDialogRef.afterClosed().subscribe(result => {
      confirmed = this.searchDialogRef!.componentInstance.data.confirmed;
      search = this.searchDialogRef!.componentInstance.data.search;
    });
  }

  /**
   * Open/Close a dialog for reloading workspace imported from an external file.
   */
  public reload(): Promise<DialogReloadPrompt> {
    return new Promise<DialogReloadPrompt>((resolve, reject) => {
      if (this.reloadDialogRef == null || this.reloadDialogRef.getState() === MatDialogState.CLOSED) {
        resolve(this.initReloadDialogRef());
        return;
      }

      this.reloadDialogRef!.close();
      let userPrompt = DialogReloadPrompt.SAVE_THEN_RELOAD;
      this.reloadDialogRef!.afterClosed().subscribe(result => {
        // Open the dialog again if a new file has been imported
        resolve(this.initReloadDialogRef());
        return;
      });
    });
  }

  private initReloadDialogRef(): Promise<DialogReloadPrompt> {
    return new Promise<DialogReloadPrompt>((resolve, reject) => {
      this.reloadDialogRef = DialogReloadComponent.dialog.open(DialogReloadContentComponent, {
        data: {
          userPrompt: DialogReloadPrompt.SAVE_THEN_RELOAD
        }
      });
      let userPrompt = DialogReloadPrompt.SAVE_THEN_RELOAD;
      this.reloadDialogRef.afterClosed().subscribe(result => {
        userPrompt = this.reloadDialogRef!.componentInstance.data.userPrompt;
        resolve(userPrompt);
      })
    });
  }

  /**
   * Open/Close a dialog for loading a workspace from an external file.
   */
  public load(): Promise<File | undefined> {
    return new Promise<File | undefined>((resolve, reject) => {
      if (this.loadDialogRef == null || this.loadDialogRef.getState() === MatDialogState.CLOSED) {
        this.loadDialogRef = DialogLoadComponent.dialog.open(DialogLoadContentComponent, {
          data: {
            file: undefined
          }
        });
      } else {
        this.loadDialogRef.close();
      }
      let file: File | undefined;
      this.loadDialogRef.afterClosed().subscribe(result => {
        file = this.loadDialogRef!.componentInstance.data.file;
        resolve(file);
      });
    });
  }
}
