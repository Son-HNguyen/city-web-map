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

import {Workspace} from "../core/Workspace";
import {Injectable} from "@angular/core";
import {Globe, GlobeEngine} from "../globe/Globe";
import {CesiumGlobe} from "../globe/CesiumGlobe";

@Injectable()
export class GlobalService {
  private _WORKSPACE: Workspace;
  private _GLOBE: Globe;

  constructor() {
    this._WORKSPACE = new Workspace({});
    // Create the globe depending on the engine type given in the workspace
    switch (this._WORKSPACE.globeEngine) {
      case GlobeEngine.CESIUM:
      default:
        this._GLOBE = new CesiumGlobe();
        break;
    }
  }

  get GLOBE(): Globe {
    return this._GLOBE;
  }

  set GLOBE(value: Globe) {
    this._GLOBE = value;
  }

  get WORKSPACE(): Workspace {
    return this._WORKSPACE;
  }

  set WORKSPACE(value: Workspace) {
    this._WORKSPACE = value;
  }
}
