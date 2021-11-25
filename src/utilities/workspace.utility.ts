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

import {LogService} from "../services/log.service";
import {UtilityService} from "../services/utils.service";
import {GridLayoutType, Workspace} from "../core/Workspace";
import {GlobalService} from "../services/global.service";

export class WorkspaceUtility {
  private logService: LogService;
  private UTILS: UtilityService;
  private GLOBALS: GlobalService;

  constructor(logService: LogService,
              GLOBALS: GlobalService,
              UTILS: UtilityService) {
    this.logService = logService;
    this.GLOBALS = GLOBALS;
    this.UTILS = UTILS;
  }

  public readFromLocalStorage(): Promise<void> {
    const scope = this;
    return new Promise<void>((resolve, reject) => {
      const workspaceString = localStorage.getItem(Workspace.STORAGE_NAME.workspace);
      const workspace = Workspace.initFrom(workspaceString);
      if (workspace == null) {
        scope.logService.warn('No compatible workspace found. A default workspace shall be created.');
        this.GLOBALS!.WORKSPACE = new Workspace();
      } else {
        this.GLOBALS!.WORKSPACE = workspace;
      }
      resolve();
    });
  }

  public saveToLocalStorage(currentLayout?: GridLayoutType, fullscreenActive?: boolean): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (currentLayout != null && fullscreenActive != null) {
        this.save(currentLayout, fullscreenActive);
      }

      // Then set local storage
      localStorage.setItem(Workspace.STORAGE_NAME.workspace, this.GLOBALS.WORKSPACE.toString());

      // Check stored size
      const cookieWorkspace = localStorage.getItem(Workspace.STORAGE_NAME.workspace);
      const Buffer = require('buffer/').Buffer;
      const bytes = Buffer.byteLength(encodeURI(cookieWorkspace!), Workspace.STRING_ENCODING);
      this.logService!.info('Save current workspace in local storage, size = ' + bytes + " Bytes");

      resolve(bytes);
    });
  }

  private save(currentLayout: GridLayoutType, fullscreenActive: boolean) {
    // Save current layout
    this.GLOBALS.WORKSPACE.gridLayout = Object.assign({}, currentLayout);
    this.GLOBALS.WORKSPACE.fullscreenActive = fullscreenActive;

    // Save last location
    this.GLOBALS.WORKSPACE.cameraLocation = this.GLOBALS.GLOBE.getCurrentCameraLocation();

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
