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

import {CookieService} from "ngx-cookie-service";
import {LogService} from "../app/log/log.service";
import {UtilityService} from "../utils.service";
import {Workspace} from "../core/Workspace";
import {GlobalService} from "../global.service";
import {GridsterItem} from "angular-gridster2";

export class WorkspaceUtility {
  private cookieService: CookieService;
  private logService: LogService;
  private UTILS: UtilityService;
  private GLOBALS: GlobalService;

  constructor(
    cookieService: CookieService,
    logService: LogService,
    GLOBALS: GlobalService,
    UTILS: UtilityService
  ) {
    this.cookieService = cookieService;
    this.logService = logService;
    this.GLOBALS = GLOBALS;
    this.UTILS = UTILS;
  }

  public readFromCookies(): Promise<boolean> {
    const scope = this;
    return new Promise<boolean>((resolve, reject) => {
      const workspaceString = scope.cookieService.get(this.GLOBALS.WORKSPACE.COOKIE_NAMES.workspace);
      if (workspaceString == null || workspaceString === '') {
        resolve(false);
        return;
      }
      try {
        // TODO Load saved grid layout
        this.GLOBALS!.WORKSPACE = Workspace.initFrom(JSON.parse(workspaceString));
        resolve(true);
      } catch (e) {
        scope.logService.info('No previous workspace found');
        resolve(false);
      }
    });
  }

  public saveToCookies(currentLayout: Array<GridsterItem>): Promise<number> {
    const scope = this;
    return new Promise<number>((resolve, reject) => {
      // Save current layout
      this.GLOBALS.WORKSPACE.gridLayout = currentLayout.map(x => Object.assign({}, x)); // Deep copy of an array!

      // Save last location
      this.GLOBALS.WORKSPACE.cameraLocation = scope.UTILS.camera.getCurrentPosition();

      // Save grid layout / dashboard
      // Since the workspace has its grid layout point to dashboard object, they are always in sync -> done
      // TODO Save space by comparing dashboard with presets and only save preset name

      // Then set cookies
      scope.cookieService!.set(
        this.GLOBALS.WORKSPACE.COOKIE_NAMES.workspace,
        this.GLOBALS.WORKSPACE.toString(),
        this.GLOBALS.WORKSPACE.COOKIE_EXPIRE);

      // Check cookie size
      const cookieWorkspace = scope.cookieService.get(this.GLOBALS.WORKSPACE.COOKIE_NAMES.workspace);
      const Buffer = require('buffer/').Buffer;
      const bytes = Buffer.byteLength(encodeURI(cookieWorkspace), this.GLOBALS.WORKSPACE.STRING_ENCODING);
      scope.logService!.info('Save current workspace in cookies, size = ' + bytes + " Bytes");

      resolve(bytes);
    });
  }
}
