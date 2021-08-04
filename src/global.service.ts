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
import {Workspace} from "./core/Workspace";

@Injectable()
export class GlobalService {
  private _addSplashWindowModel: SplashWindowModel;
  private _cesiumViewer: any;
  private _cesiumCamera: any;
  private readonly _cookieExpireDefault;
  private readonly _cookieNames: CookieNamesConfig;
  private _workspace: Workspace;

  constructor() {
    this._addSplashWindowModel = {
      url: "",
      showOnStart: true
    };
    this._cookieExpireDefault = 7;
    this._cookieNames = {
      cameraPosition: 'cameraPosition',
      workspace: 'workspace'
    };
    this._workspace = new Workspace(
      "Workspace title",
      "Workspace description",
      "Workspace maintainer",
      [],
      [],
      [],
      [],
      undefined,
      []
    );
  }

  get cesiumCamera(): any {
    return this._cesiumCamera;
  }

  set cesiumCamera(value: any) {
    this._cesiumCamera = value;
  }

  get addSplashWindowModel(): SplashWindowModel {
    return this._addSplashWindowModel;
  }

  set addSplashWindowModel(value: SplashWindowModel) {
    this._addSplashWindowModel = value;
  }

  get cesiumViewer() {
    return this._cesiumViewer;
  }

  set cesiumViewer(value) {
    this._cesiumViewer = value;
  }

  get cookieExpireDefault() {
    return this._cookieExpireDefault;
  }

  get cookieNames(): CookieNamesConfig {
    return this._cookieNames;
  }

  get workspace(): Workspace {
    return this._workspace;
  }

  set workspace(value: Workspace) {
    this._workspace = value;
  }
}

interface SplashWindowModel {
  url: string;
  showOnStart: boolean;
}

interface CookieNamesConfig {
  cameraPosition: string,
  workspace: string
}
