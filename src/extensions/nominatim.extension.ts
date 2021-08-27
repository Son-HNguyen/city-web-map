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

import * as Cesium from "cesium";

// Source: https://cesiumjs.org/Cesium/Build/Apps/Sandcastle/?src=Custom%20Geocoder.html

/**
 * This class is an example of a custom geocoder. It provides geocoding through the OpenStreetMap Nominatim service.
 * @alias OpenStreetMapNominatimGeocoder
 * @constructor
 */
export class NominatimExtension {
  constructor() {
  }

  /**
   * The function called to geocode using this geocoder service.
   *
   * @param {String} input The query to be sent to the geocoder service
   * @returns {Promise<GeocoderService~Result[]>}
   */
  geocode(input: string) {
    var endpoint = "https://nominatim.openstreetmap.org/search";
    var resource = new Cesium.Resource({
      url: endpoint,
      queryParameters: {
        format: "json",
        q: input,
      },
    });

    // @ts-ignore
    return resource.fetchJson().then(function (results) {
      var bboxDegrees;
      return results.map(function (resultObject: any) {
        bboxDegrees = resultObject.boundingbox;
        return {
          displayName: resultObject.display_name,
          destination: Cesium.Rectangle.fromDegrees(
            bboxDegrees[2],
            bboxDegrees[0],
            bboxDegrees[3],
            bboxDegrees[1]
          ),
        };
      });
    });
  }
}
