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
  DialogConfirmContentComponent,
  DialogConfirmComponent,
  DialogErrorContentComponent,
  DialogInfoContentComponent,
  DialogInfoComponent,
  DialogWarningContentComponent,
  DialogWarningComponent
} from '../app/dialog/dialog.function';

export class DialogUtility {
  constructor() {
  }

  /**
   * Open an info pop-up with given content.
   */
  public info(content: string): void {
    DialogInfoComponent.dialog.open(DialogInfoContentComponent, {
      data: {
        message: content
      }
    });
  }

  /**
   * Open an error pop-up with given content.
   */
  public error(content: string): void {
    DialogWarningComponent.dialog.open(DialogErrorContentComponent, {
      data: {
        message: content
      }
    });
  }

  /**
   * Open an warning pop-up with given content.
   */
  public warn(content: string): void {
    DialogWarningComponent.dialog.open(DialogWarningContentComponent, {
      data: {
        message: content
      }
    });
  }

  /**
   * Open an dialog pop-up and ask for confirmation.
   */
  public confirm(content: string): boolean {
    const dialogRef = DialogConfirmComponent.dialog.open(DialogConfirmContentComponent, {
      data: {
        message: content
      }
    });

    let confirmed = false;
    dialogRef.afterClosed().subscribe(result => {
      confirmed = dialogRef.componentInstance.data.confirmed;
    });

    return confirmed;
  }
}
