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

import {SnackBarComponent, SnackBarContentComponent} from "../app/snack-bar/snack-bar.component";
import {MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

export class SnackBarUtility {
  constructor() {
  }

  public show(message: string, options?: SnackBarOption): void {
    SnackBarComponent.snackBar.openFromComponent(SnackBarContentComponent, {
      data: {
        message: message
      },
      duration: (options != null && options.duration != null) ?
        options.duration : SnackBarComponent.duration,
      horizontalPosition: (options != null && options.horizontalPosition != null) ?
        options.horizontalPosition : SnackBarComponent.horizontalPosition,
      verticalPosition: (options != null && options.verticalPosition != null) ?
        options.verticalPosition : SnackBarComponent.verticalPosition
    });
  }
}

export interface SnackBarOption {
  duration?: number;
  horizontalPosition?: MatSnackBarHorizontalPosition,
  verticalPosition?: MatSnackBarVerticalPosition
}
