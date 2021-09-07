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

  constructor(cookieService: CookieService,
              logService: LogService,
              GLOBALS: GlobalService,
              UTILS: UtilityService
  ) {
    this.cookieService = cookieService;
    this.logService = logService;
    this.GLOBALS = GLOBALS;
    this.UTILS = UTILS;
  }

  public readFromCookies(): Promise<void> {
    const scope = this;
    return new Promise<void>((resolve, reject) => {
      const workspaceString = scope.cookieService.get(Workspace.COOKIE_NAMES.workspace);
      try {
        this.GLOBALS!.WORKSPACE = Workspace.initFrom(JSON.parse(workspaceString));
        resolve();
      } catch (e) {
        scope.logService.warn('No compatible workspace found. A default workspace shall be created.');
        this.GLOBALS!.WORKSPACE = new Workspace();
        resolve();
      }
    });
  }

  public saveToCookies(currentLayout?: Array<GridsterItem>, fullscreenActive?: boolean): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (currentLayout != null && fullscreenActive != null) {
        this.save(currentLayout, fullscreenActive);
      }

      // Then set cookies
      this.cookieService!.set(
        Workspace.COOKIE_NAMES.workspace,
        this.GLOBALS.WORKSPACE.toString(),
        Workspace.COOKIE_EXPIRE);

      // Check cookie size
      const cookieWorkspace = this.cookieService.get(Workspace.COOKIE_NAMES.workspace);
      const Buffer = require('buffer/').Buffer;
      const bytes = Buffer.byteLength(encodeURI(cookieWorkspace), Workspace.STRING_ENCODING);
      this.logService!.info('Save current workspace in cookies, size = ' + bytes + " Bytes");

      resolve(bytes);
    });
  }

  private save(currentLayout: Array<GridsterItem>, fullscreenActive: boolean) {
    // Save current layout
    this.GLOBALS.WORKSPACE.gridLayout = currentLayout.map(x => Object.assign({}, x)); // Deep copy of an array!
    this.GLOBALS.WORKSPACE.fullscreenActive = fullscreenActive;

    // Save last location
    this.GLOBALS.WORKSPACE.cameraLocation = this.UTILS.camera.getCurrentPosition();

    // Save grid layout / dashboard
    // Since the workspace has its grid layout point to dashboard object, they are always in sync -> done
    // TODO Save space by comparing dashboard with presets and only save preset name
  }

  public saveToFile(filename: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let workspaceContent = this.GLOBALS.WORKSPACE.toString();

      // Then export file
      const FileSaver = require('file-saver');
      const blob = new Blob([workspaceContent], {type: 'application/json'});
      try {
        FileSaver.saveAs(blob, filename);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
