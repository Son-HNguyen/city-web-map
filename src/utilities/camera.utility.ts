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

import * as cesium from "cesium";
import {Injectable} from "@angular/core";
import {GlobalService} from "../services/global.service";

@Injectable()
export class CameraUtility {
  private GLOBALS: GlobalService;

  constructor(GLOBALS: GlobalService) {
    this.GLOBALS = GLOBALS;
  }

  /**
   * Return the current Cesium camera position.
   */
  public getCurrentPosition(): CesiumCameraLocation {
    const cesiumCamera = this.GLOBALS.CESIUM_VIEWER.scene.camera;
    const position = cesium.Ellipsoid.WGS84.cartesianToCartographic(cesiumCamera.position);
    const latitude = cesium.Math.toDegrees(position.latitude);
    const longitude = cesium.Math.toDegrees(position.longitude);
    const height = position.height;
    const heading = cesium.Math.toDegrees(cesiumCamera.heading);
    const pitch = cesium.Math.toDegrees(cesiumCamera.pitch);
    const roll = cesium.Math.toDegrees(cesiumCamera.roll);

    const result: CesiumCameraLocation = {
      latitude,
      longitude,
      height,
      heading,
      pitch,
      roll
    };

    return result;
  }

  /**
   * Change the current Cesium camera position.
   */
  public flyToPosition(cesiumCameraPosition: CesiumCameraLocation): Promise<void> {
    const scope = this;
    return new Promise<void>((resolve, reject) => {
      scope.GLOBALS.CESIUM_CAMERA.flyTo({
        destination: cesium.Cartesian3.fromDegrees(
          cesiumCameraPosition.longitude, cesiumCameraPosition.latitude, cesiumCameraPosition.height),
        orientation: {
          heading: cesium.Math.toRadians(cesiumCameraPosition.heading),
          pitch: cesium.Math.toRadians(cesiumCameraPosition.pitch),
          roll: cesium.Math.toRadians(cesiumCameraPosition.roll)
        }
      });
      resolve();
    });
  }
}

export interface CesiumCameraLocation {
  latitude: number;
  longitude: number;
  height: number;
  heading: number;
  pitch: number;
  roll: number;
}
