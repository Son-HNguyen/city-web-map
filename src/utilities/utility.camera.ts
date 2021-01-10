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

import {LogService} from "../app/log/log.service";
import {environment as ENV} from "../environments/environment";

export interface CesiumCameraPosition {
  latitude: number,
  longitude: number,
  height: number,
  heading: number,
  pitch: number,
  roll: number
}

export class UtilityCamera {
  /**
   * Return the current Cesium camera position.
   */
  static getPosition(): CesiumCameraPosition {
    let cesiumCamera = ENV.cesiumViewer.scene.camera;
    let position = ENV.Cesium.Ellipsoid.WGS84.cartesianToCartographic(cesiumCamera.position);
    let latitude = ENV.Cesium.Math.toDegrees(position.latitude);
    let longitude = ENV.Cesium.Math.toDegrees(position.longitude);
    let height = position.height;
    let heading = ENV.Cesium.Math.toDegrees(cesiumCamera.heading);
    let pitch = ENV.Cesium.Math.toDegrees(cesiumCamera.pitch);
    let roll = ENV.Cesium.Math.toDegrees(cesiumCamera.roll);

    let result: CesiumCameraPosition = {
      latitude: latitude,
      longitude: longitude,
      height: height,
      heading: heading,
      pitch: pitch,
      roll: roll
    };

    return result;
  }

  /**
   * Change the current Cesium camera position.
   */
  static flyToPosition(cesiumCameraPosition: CesiumCameraPosition): void {
    ENV.cesiumCamera.flyTo({
      destination: ENV.Cesium.Cartesian3.fromDegrees(cesiumCameraPosition.longitude, cesiumCameraPosition.latitude, cesiumCameraPosition.height),
      orientation: {
        heading: ENV.Cesium.Math.toRadians(cesiumCameraPosition.heading),
        pitch: ENV.Cesium.Math.toRadians(cesiumCameraPosition.pitch),
        roll: ENV.Cesium.Math.toRadians(cesiumCameraPosition.roll)
      }
    });
  }
}
