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

import {GeocoderType} from "../core/Workspace";
import {KMLModelLayer} from "../core/KMLModelLayer";
import {CityDBTilesModelLayer} from "../core/CityDBTilesModelLayer";
import {Cesium3DTilesModelLayer} from "../core/Cesium3DTilesModelLayer";
import {LayerTypes, ModelLayer, ModelLayerOptionsType} from "../core/ModelLayer";

export enum GlobeEngine {
  CESIUM = "cesium"
}

export enum GeocoderService {
  CARTOGRAPHIC = 'Cartographic',
  CESIUM_ION = 'Cesium ion',
  NOMINATIM = 'Nominatim'
  // TODO Support for other geocoder services, search in https://cesium.com/learn/cesiumjs/ref-doc
}

export abstract class Globe {
  public abstract CAMERA: any;
  public abstract VIEWER: any;
  public abstract readonly DEFAULT_IMAGERY_LAYERS: ImageryLayersType;
  public abstract readonly DEFAULT_IMAGERY_LAYER_INDEX: number;

  public abstract initCameraAndViewer(): void;

  public abstract getCurrentCameraLocation(): CameraLocation;

  public abstract flyToCameraLocation(cameraLocation: CameraLocation): Promise<void>;

  public abstract setImageryLayer(index: number): any;

  public abstract setGeocoder(geocoder: GeocoderType): void;

  public abstract addKMLModelLayer(modelLayer: KMLModelLayer, fly?: boolean): Promise<any>; // returns an object on globe representing the model layer

  public abstract addCityDBTilesModelLayer(modelLayer: CityDBTilesModelLayer, fly?: boolean): Promise<any>;

  public abstract addCesium3DTilesModelLayer(modelLayer: Cesium3DTilesModelLayer, fly?: boolean): Promise<any>;

  public abstract activateModelLayer(objectOnGlobe: any): void;

  public abstract deactivateModelLayer(objectOnGlobe: any): void;

  public abstract flyToObjects(objects: any): Promise<void>;

  // =================================================

  /**
   * Add a model layer to the globe.
   *
   * @param options Can be an already existing model layer or options to create a new one.
   * @param fly Fly to the model layer on the globe after adding. Only executes when this is set to true.
   */
  public addModelLayer(options: ModelLayerOptionsType | ModelLayer, fly?: boolean): Promise<AddedModelLayerAndObjectOnGlobeType> {
    return new Promise<AddedModelLayerAndObjectOnGlobeType>(async (resolve, reject) => {
      let modelLayer: ModelLayer;
      let objectOnGlobe: any;
      switch (options.type) { // TODO Add generalized layer, not only KML
        case LayerTypes.KML:
          modelLayer = options instanceof ModelLayer ? options : new KMLModelLayer(options);
          objectOnGlobe = await this.addKMLModelLayer(modelLayer, fly);
          break;
        case LayerTypes.CITYDB_TILES:
          modelLayer = options instanceof ModelLayer ? options : new CityDBTilesModelLayer(options);
          objectOnGlobe = await this.addCityDBTilesModelLayer(modelLayer, fly);
          break;
        case LayerTypes.CESIUM_3D_TILES:
          modelLayer = options instanceof ModelLayer ? options : new Cesium3DTilesModelLayer(options);
          objectOnGlobe = await this.addCesium3DTilesModelLayer(modelLayer, fly);
          break;
        default:
          reject();
          return;
      }
      resolve({modelLayer, objectOnGlobe});
      return;
    });
  }
}

export interface ImageryLayersType {
  BING_MAPS_AERIAL: ImageryLayerType,
  BING_MAPS_AERIAL_WITH_LABELS: ImageryLayerType,
  BING_MAPS_ROADS: ImageryLayerType,
  ESRI_WORLD_IMAGERY: ImageryLayerType,
  ESRI_WORLD_STREETMAP: ImageryLayerType,
  ESRI_NATIONAL_GEOGRAPHIC: ImageryLayerType,
  OPEN_STREET_MAP: ImageryLayerType,
  STAMEN_WATERCOLOR: ImageryLayerType,
  STAMEN_TONER: ImageryLayerType,
  SENTINEL_2: ImageryLayerType,
  BLUE_MARBLE: ImageryLayerType,
  EARTH_AT_NIGHT: ImageryLayerType,
  NATURAL_EARTH_II: ImageryLayerType
}

export interface ImageryLayerType {
  index: number,
  name: string,
  iconUrl: string,
  tooltip: string,
  category: string
}

export interface CameraLocation {
  latitude: number;
  longitude: number;
  height: number;
  heading: number;
  pitch: number;
  roll: number;
}

export interface AddedModelLayerAndObjectOnGlobeType {
  modelLayer: ModelLayer,
  objectOnGlobe: any // The model layer's representation on the selected globe
}
