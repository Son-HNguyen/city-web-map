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

import {Workspace} from "./core/Workspace";
import {Injectable} from "@angular/core";

@Injectable()
export class GlobalService {
  private _WORKSPACE: Workspace;
  private _CESIUM_VIEWER: any;
  private _CESIUM_CAMERA: any;

  constructor() {
    this._WORKSPACE = new Workspace();
  }

  get WORKSPACE(): Workspace {
    return this._WORKSPACE;
  }

  set WORKSPACE(value: Workspace) {
    this._WORKSPACE = value;
  }

  get CESIUM_VIEWER(): any {
    return this._CESIUM_VIEWER;
  }

  set CESIUM_VIEWER(value: any) {
    this._CESIUM_VIEWER = value;
  }

  get CESIUM_CAMERA(): any {
    return this._CESIUM_CAMERA;
  }

  set CESIUM_CAMERA(value: any) {
    this._CESIUM_CAMERA = value;
  }
}
