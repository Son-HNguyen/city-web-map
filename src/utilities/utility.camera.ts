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

import {LogService} from '../app/log/log.service';
import {environment as ENV} from '../environments/environment';

export interface CesiumCameraPosition {
  latitude: number;
  longitude: number;
  height: number;
  heading: number;
  pitch: number;
  roll: number;
}

export class UtilityCamera {
  /**
   * Return the current Cesium camera position.
   */
  static getPosition(): CesiumCameraPosition {
    const cesiumCamera = ENV.cesiumViewer.scene.camera;
    const position = ENV.cesium.Ellipsoid.WGS84.cartesianToCartographic(cesiumCamera.position);
    const latitude = ENV.cesium.Math.toDegrees(position.latitude);
    const longitude = ENV.cesium.Math.toDegrees(position.longitude);
    const height = position.height;
    const heading = ENV.cesium.Math.toDegrees(cesiumCamera.heading);
    const pitch = ENV.cesium.Math.toDegrees(cesiumCamera.pitch);
    const roll = ENV.cesium.Math.toDegrees(cesiumCamera.roll);

    const result: CesiumCameraPosition = {
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
  static flyToPosition(cesiumCameraPosition: CesiumCameraPosition): void {
    ENV.cesiumCamera.flyTo({
      destination: ENV.cesium.Cartesian3.fromDegrees(
        cesiumCameraPosition.longitude, cesiumCameraPosition.latitude, cesiumCameraPosition.height),
      orientation: {
        heading: ENV.cesium.Math.toRadians(cesiumCameraPosition.heading),
        pitch: ENV.cesium.Math.toRadians(cesiumCameraPosition.pitch),
        roll: ENV.cesium.Math.toRadians(cesiumCameraPosition.roll)
      }
    });
  }
}
