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

import {ModelLayer, ModelLayerOptionsType} from "./ModelLayer";
import {LogService} from "../services/log.service";
import {GlobalService} from "../services/global.service";

export class CitydbLayer extends ModelLayer {
  constructor(
    options: ModelLayerOptionsType,
    private LOGGER?: LogService,
    private GLOBALS?: GlobalService
  ) {
    super(options);
  }

  public addToGlobe(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const fileExtension = this.url.toString().split('.').pop();
      if (fileExtension == null || fileExtension.trim() === '') {
        this.LOGGER!.warn('The given model URL must contain a file extension .json, .kml, .kmz oder .czml!')
        return reject();
      }
      switch (fileExtension.trim().toLowerCase()) {
        case 'json':
          break;
        case 'kml':
        case 'kmz':
          return this.GLOBALS!.GLOBE.addKMLModelLayer(this);
        case 'czml':
          break;
        default:
          this.LOGGER!.warn('The given model URL must contain a file extension .json, .kml, .kmz oder .czml!')
          return reject();
      }
    });
  }
}
