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
import {GlobalService} from "../global.service";

export class WorkspaceUtility {
  private cookieService: CookieService;
  private logService: LogService;
  private GLOBALS: GlobalService;
  private UTILS: UtilityService;

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
      if (scope.logService != null) {
        scope.logService.info('Resume camera location from the last session');
      }
      if (scope.cookieService != null) {
        const cookieWorkspace = scope.cookieService.get(scope.GLOBALS!.cookieNames.workspace);
        if (cookieWorkspace != null) {
          const objectWorkspace = JSON.parse(cookieWorkspace);
          scope.UTILS!.camera.flyToPosition(objectWorkspace._lastLocation);
          resolve(true);
        }
      }
    });
  }

  public saveToCookies(): Promise<boolean> {
    const scope = this;
    return new Promise<boolean>((resolve, reject) => {
      if (scope.logService != null) {
        scope.logService.info('Save current workspace in cookies');
      }
      if (scope.cookieService != null) {
        // Save last location first
        scope.GLOBALS!.workspace.lastLocation = scope.UTILS!.camera.getCurrentPosition();
        // Then set cookies
        scope.cookieService!.set(
          scope.GLOBALS!.cookieNames.workspace,
          scope.GLOBALS!.workspace.toString(),
          scope.GLOBALS!.cookieExpireDefault);
        resolve(true);
      }
    });
  }
}
