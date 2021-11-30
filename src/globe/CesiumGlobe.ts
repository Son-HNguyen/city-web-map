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

import {CameraLocation, GeocoderService, Globe, ImageryLayersType} from "./Globe";
import * as Cesium from "cesium";
import {GeocoderType} from "../core/Workspace";
import {NominatimExtension} from "../extensions/nominatim.extension";
import {ModelLayer} from "../core/ModelLayer";
import {LogService} from "../services/log.service";

export class CesiumGlobe extends Globe {
  public CAMERA: any;
  public VIEWER: any;
  public readonly DEFAULT_IMAGERY_LAYERS: ImageryLayersType;
  public readonly DEFAULT_IMAGERY_LAYER_INDEX: number;

  constructor(private LOGGER?: LogService) {
    super();
    // Default info for all available imagery layers in Cesium
    // Texts taken from
    // https://github.com/CesiumGS/cesium/blob/main/Source/Widgets/BaseLayerPicker/createDefaultImageryProviderViewModels.js
    this.DEFAULT_IMAGERY_LAYERS = {
      BING_MAPS_AERIAL: {
        index: 0,
        name: "Bing Maps Aerial",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/bingAerial.png",
        tooltip: "Bing Maps aerial imagery, provided by Cesium ion",
        category: "Cesium ion"
      },
      BING_MAPS_AERIAL_WITH_LABELS: {
        index: 1,
        name: "Bing Maps Aerial with Labels",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/bingAerialLabels.png",
        tooltip: "Bing Maps aerial imagery with labels, provided by Cesium ion",
        category: "Cesium ion"
      },
      BING_MAPS_ROADS: {
        index: 2,
        name: "Bing Maps Roads",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/bingRoads.png",
        tooltip: "Bing Maps standard road maps, provided by Cesium ion",
        category: "Cesium ion",
      },
      ESRI_WORLD_IMAGERY: {
        index: 3,
        name: "ESRI World Imagery",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/esriWorldImagery.png",
        tooltip: "\
  World Imagery provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution \
satellite imagery worldwide.  The map includes NASA Blue Marble: Next Generation 500m resolution imagery at small scales \
(above 1:1,000,000), i-cubed 15m eSAT imagery at medium-to-large scales (down to 1:70,000) for the world, and USGS 15m Landsat \
imagery for Antarctica. The map features 0.3m resolution imagery in the continental United States and 0.6m resolution imagery in \
parts of Western Europe from DigitalGlobe. In other parts of the world, 1 meter resolution imagery is available from GeoEye IKONOS, \
i-cubed Nationwide Prime, Getmapping, AeroGRID, IGN Spain, and IGP Portugal.  Additionally, imagery at different resolutions has been \
contributed by the GIS User Community.\nhttp://www.esri.com",
        category: "ESRI"
      },
      ESRI_WORLD_STREETMAP: {
        index: 4,
        name: "ESRI World Street Map",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/esriWorldStreetMap.png",
        tooltip:
          "\
  This worldwide street map presents highway-level data for the world. Street-level data includes the United States; much of \
  Canada; Japan; most countries in Europe; Australia and New Zealand; India; parts of South America including Argentina, Brazil, \
  Chile, Colombia, and Venezuela; Ghana; and parts of southern Africa including Botswana, Lesotho, Namibia, South Africa, and Swaziland.\n\
  http://www.esri.com",
        category: "ESRI"
      },
      ESRI_NATIONAL_GEOGRAPHIC: {
        index: 5,
        name: "ESRI National Geographic",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/esriNationalGeographic.png",
        tooltip:
          "\
  This web map contains the National Geographic World Map service. This map service is designed to be used as a general reference map \
  for informational and educational purposes as well as a basemap by GIS professionals and other users for creating web maps and web \
  mapping applications.\nhttp://www.esri.com",
        category: "ESRI"
      },
      OPEN_STREET_MAP: {
        index: 6,
        name: "Open Street Map",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/openStreetMap.png",
        tooltip:
          "OpenStreetMap (OSM) is a collaborative project to create a free editable map \
  of the world.\nhttp://www.openstreetmap.org",
        category: "Open Street Map"
      },
      STAMEN_TONER: {
        index: 7,
        name: "Stamen Watercolor",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/stamenWatercolor.png",
        tooltip:
          "Reminiscent of hand drawn maps, Stamen watercolor maps apply raster effect \
  area washes and organic edges over a paper texture to add warm pop to any map.\nhttp://maps.stamen.com",
        category: "Stamen"
      },
      STAMEN_WATERCOLOR: {
        index: 8,
        name: "Stamen Toner",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/stamenToner.png",
        tooltip: "A high contrast black and white map.\nhttp://maps.stamen.com",
        category: "Stamen"
      },
      SENTINEL_2: {
        index: 9,
        name: "Sentinel-2",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/sentinel-2.png",
        tooltip:
          "Sentinel-2 cloudless by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 and 2017).",
        category: "Cesium ion"
      },
      BLUE_MARBLE: {
        index: 10,
        name: "Blue Marble",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/blueMarble.png",
        tooltip: "Blue Marble Next Generation July, 2004 imagery from NASA.",
        category: "Cesium ion"
      },
      EARTH_AT_NIGHT: {
        index: 11,
        name: "Earth at night",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/earthAtNight.png",
        tooltip:
          "The Earth at night, also known as The Black Marble, is a 500 meter resolution global composite imagery layer released by NASA.",
        category: "Cesium ion"
      },
      NATURAL_EARTH_II: {
        index: 12,
        name: "Natural Earth II",
        iconUrl: "src/assets/cesium/Widgets/Images/ImageryProviders/naturalEarthII.png",
        tooltip:
          "Natural Earth II, darkened for contrast.\nhttp://www.naturalearthdata.com/",
        category: "Cesium ion"
      }
    };
    this.DEFAULT_IMAGERY_LAYER_INDEX = this.DEFAULT_IMAGERY_LAYERS.ESRI_WORLD_IMAGERY.index;
  }

  public initCameraAndViewer() {
    // TODO Central manager for URL parameters
    const URL = require('url-parse');
    const shadows = (new URL(window.location.href, true)).query.shadows; // TODO Read from cookie/settings? Add toggle?
    const terrainShadows = (new URL(window.location.href, true)).query.terrainShadows; // TODO Read from cookie/settings? Add toggle?
    this.VIEWER = new Cesium.Viewer('cesiumContainer', {
      // TODO Hardcoded imagery provider?
      //selectedImageryProviderViewModel: ENV.cesium.createDefaultImageryProviderViewModels()[1],
      shadows: (shadows === 'true'), // TODO Toggle shadow using an app
      terrainShadows: parseInt(terrainShadows, 10),
      timeline: false,
      animation: false,
      fullscreenButton: false,
    });
    this.CAMERA = this.VIEWER.scene.camera;
  }

  public getCurrentCameraLocation(): CameraLocation {
    const position = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.CAMERA.position);
    const latitude = Cesium.Math.toDegrees(position.latitude);
    const longitude = Cesium.Math.toDegrees(position.longitude);
    const height = position.height;
    const heading = Cesium.Math.toDegrees(this.CAMERA.heading);
    const pitch = Cesium.Math.toDegrees(this.CAMERA.pitch);
    const roll = Cesium.Math.toDegrees(this.CAMERA.roll);

    const result: CameraLocation = {
      latitude,
      longitude,
      height,
      heading,
      pitch,
      roll
    };

    return result;
  }

  public flyToCameraLocation(cameraLocation: CameraLocation): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.CAMERA.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          cameraLocation.longitude,
          cameraLocation.latitude,
          cameraLocation.height
        ),
        orientation: {
          heading: Cesium.Math.toRadians(cameraLocation.heading),
          pitch: Cesium.Math.toRadians(cameraLocation.pitch),
          roll: Cesium.Math.toRadians(cameraLocation.roll)
        }
      });
      resolve();
    });
  }

  public setImageryLayer(index: number): void {
    const imageryProviders = this.VIEWER.baseLayerPicker.viewModel.imageryProviderViewModels;
    this.VIEWER.baseLayerPicker.viewModel.selectedImagery = imageryProviders[index];
  }

  public setGeocoder(geocoder: GeocoderType) {
    // TODO Check whether a non-default ion access token is available, if not then use Nominatim
    this.VIEWER.geocoder.viewModel.autoComplete = geocoder.autocomplete; // TODO On/Off for ion/Nominatim?
    let geocoderServices = [];
    for (let s of geocoder.geocoderServices) {
      switch (s) {
        case GeocoderService.CARTOGRAPHIC:
          geocoderServices.push(new Cesium.CartographicGeocoderService());
          break;
        case GeocoderService.CESIUM_ION:
          geocoderServices.push(new Cesium.IonGeocoderService({
            scene: this.VIEWER.scene
          }));
          break;
        case GeocoderService.NOMINATIM:
          geocoderServices.push(new NominatimExtension());
          break;
      }
    }
    this.VIEWER.geocoder.viewModel._geocoderServices = geocoderServices;
  }

  public addKMLModelLayer(modelLayer: ModelLayer): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        let kmlDataSource = await Cesium.KmlDataSource.load(
          modelLayer.url.toString(), // TODO Check for proxy? https://github.com/3dcitydb/3dcitydb-web-map/blob/c4eebdca6fe89ed964c97959dc73f379fe04fbab/js/CitydbKmlLayer.js#L456
          {
            camera: this.CAMERA,
            canvas: this.VIEWER.scene.canvas,
            clampToGround: true // TODO Add option to toggle clampToGround and save it in the model layer info
          }
        );
        this.VIEWER.dataSources.add(kmlDataSource);
        // Fly to the added layer
        await this.flyToObjects(kmlDataSource.entities);
        resolve();
      } catch (error) {
        this.LOGGER!.error('Could not add KML layer to globe: ' + error);
        reject();
      }
    });
  }

  public flyToObjects(objects: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.VIEWER.flyTo(objects);
        resolve();
      } catch (error) {
        reject();
      }
    });
  }
}
