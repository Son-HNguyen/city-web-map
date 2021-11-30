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
import {ModelLayer} from "../core/ModelLayer";

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

  public abstract addKMLModelLayer(modelLayer: ModelLayer): Promise<void>;

  public abstract flyToObjects(objects: any): Promise<void>;
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
