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

import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import * as Cesium from "cesium";

import {AppModule} from "./app/app.module";
import {environment as env} from "./environments/environment";
import {UtilityDialog} from "./utilities/utility.dialog";

import {UtilityOS} from "./utilities/utility.os";
import {ExtensionMobile} from "./extensions/extension.mobile";
import {ExtensionDesktop} from "./extensions/extension.desktop";

if (env.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

(<any>window)["CESIUM_BASE_URL"] = "src/assets/cesium/";

// Init settings first, then init client
initSettings(initClient);

function initSettings(callback: () => void): void {

  // Set default input parameter value and bind the view and model
  let addLayerViewModel = {
    url: "",
    name: "",
    layerDataType: "",
    layerProxy: false,
    layerClampToGround: true,
    gltfVersion: "",
    thematicDataUrl: "",
    thematicDataSourceType: "",
    tableType: "",
    // googleSheetsApiKey: "",
    // googleSheetsRanges: "",
    // googleSheetsClientId: "",
    cityobjectsJsonUrl: "",
    minLodPixels: 0,
    maxLodPixels: 0,
    maxSizeOfCachedTiles: 200,
    maxCountOfVisibleTiles: 200
  };

  callback();
}

function initClient(): void {

}
