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

import {Injectable} from '@angular/core';
import {CameraUtility} from "./utilities/camera.utility";
import {DialogUtility} from "./utilities/dialog.utility";
import {OsUtility} from "./utilities/os.utility";
import {SnackBarUtility} from "./utilities/snack-bar.utility";
import {WorkspaceUtility} from "./utilities/workspace.utility";
import {CookieService} from "ngx-cookie-service";
import {LogService} from "./app/log/log.service";
import {GlobalService} from "./global.service";

@Injectable()
export class UtilityService {
  private readonly _camera: CameraUtility;
  private readonly _dialog: DialogUtility;
  private readonly _snackBar: SnackBarUtility;
  private readonly _os: OsUtility;
  private readonly _workspace: WorkspaceUtility;

  constructor(
    private cookieService?: CookieService,
    private logService?: LogService,
    private GLOBALS?: GlobalService) {
    this._camera = new CameraUtility(this.GLOBALS!);
    this._dialog = new DialogUtility();
    this._snackBar = new SnackBarUtility();
    this._os = new OsUtility();
    this._workspace = new WorkspaceUtility(this.cookieService!, this.logService!, this.GLOBALS!, this);
  }

  get camera(): CameraUtility {
    return this._camera;
  }

  get dialog(): DialogUtility {
    return this._dialog;
  }

  get snackBar(): SnackBarUtility {
    return this._snackBar;
  }

  get os(): OsUtility {
    return this._os;
  }

  get workspace(): WorkspaceUtility {
    return this._workspace;
  }
}
