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

import {ModelLayer} from "./ModelLayer";
import {BaseLayer} from "./BaseLayer";
import {TerrainLayer} from "./TerrainLayer";
import {Viewpoint} from "./Viewpoint";
import {CesiumCameraLocation} from "../utilities/camera.utility";
import {GridsterItem} from "angular-gridster2";
import {DatePickerTimeRange, SpeedMultipliers} from "../app/timeline/timeline.component";
import _ = require("lodash");

export enum GeocoderService {
  CARTOGRAPHIC = 'Cartographic',
  CESIUM_ION = 'Cesium ion',
  NOMINATIM = 'Nominatim'
  // TODO Support for other geocoder services, search in https://cesium.com/learn/cesiumjs/ref-doc
}

export class Workspace {
  // ==============================
  // ABOUT
  // ==============================
  private readonly _about: AboutConfig = {
    software: 'City Web Map',
    version: '0.1.0',
    url: new URL('https://www.3dcitydb.org'),
    repositories: {
      github: new URL('https://github.com/3dcitydb/3dcitydb-web-map')
    },
    developer: {
      name: 'Son H. Nguyen (son.nguyen@tum.de)',
      organization: 'Chair of Geoinformatics, Department of Aerospace and Geodesy, Technical University of Munich',
      url: new URL('https://www.asg.ed.tum.de/en/gis/home')
    }
  };

  // ==============================
  // METADATA
  // ==============================
  private _title: string;
  private _description: string;
  private _maintainer: string;
  public static readonly DEFAULT_WORKSPACE_FILENAME = 'workspace.json';

  // ==============================
  // MODEL LAYERS
  // ==============================
  private _modelLayers: Array<ModelLayer>;
  private _baseLayers: Array<BaseLayer>;
  private _terrainLayers: Array<TerrainLayer>;

  // ==============================
  // WIDGETS
  // ==============================
  private _timeline: TimeLineConfig;
  public static readonly DEFAULT_TIMELINE: TimeLineConfig = {
    autoplay: false,
    current: new Date(),
    multiplier: SpeedMultipliers.NORMAL,
    range: undefined
  }

  private _viewpoints: Array<Viewpoint>;

  // ==============================
  // LAYOUT
  // ==============================
  private _gridLayout: Array<GridsterItem>;
  // Gridlayout in 20 X 20
  // NOTE: DO NOT CHANGE THE ORDER OF THE APPS WITHIN THE LAYOUT (e.g. Menu bar is at index 0, etc.)
  // IF THE LAYOUT HAS BEEN CHANGED, MAKE SURE TO ADJUST THE INDICES OF gridster-item IN app.component.hml ACCORDINGLY
  public static readonly DEFAULT_LAYOUTS: GridLayouts = {
    layoutLeftGlobe: [
      {cols: 20, rows: 1, y: 0, x: 0}, // Menu bar
      {cols: 3, rows: 9, y: 1, x: 14}, // Workspace View
      {cols: 3, rows: 9, y: 10, x: 14}, // Detail View
      {cols: 3, rows: 18, y: 1, x: 17}, // Info View
      {cols: 14, rows: 18, y: 1, x: 0}, // Cesium app
      {cols: 20, rows: 1, y: 19, x: 0} // Status View
    ],
    layoutCenterGlobe: [
      {cols: 20, rows: 1, y: 0, x: 0}, // Menu bar
      {cols: 3, rows: 9, y: 1, x: 0}, // Workspace View
      {cols: 3, rows: 9, y: 10, x: 0}, // Detail View
      {cols: 3, rows: 18, y: 1, x: 17}, // Info View
      {cols: 14, rows: 18, y: 1, x: 3}, // Cesium app
      {cols: 20, rows: 1, y: 19, x: 0} // Status View
    ],
    layoutRightGlobe: [
      {cols: 20, rows: 1, y: 0, x: 0}, // Menu bar
      {cols: 3, rows: 9, y: 1, x: 0}, // Workspace View
      {cols: 3, rows: 9, y: 10, x: 0}, // Detail View
      {cols: 3, rows: 18, y: 1, x: 3}, // Info View
      {cols: 14, rows: 18, y: 1, x: 6}, // Cesium app
      {cols: 20, rows: 1, y: 19, x: 0} // Status View
    ],
    layoutFullscreen: [
      {cols: 0, rows: 0, y: 0, x: 0}, // Menu bar
      {cols: 0, rows: 0, y: 0, x: 0}, // Workspace View
      {cols: 0, rows: 0, y: 0, x: 0}, // Detail View
      {cols: 0, rows: 0, y: 0, x: 0}, // Info View
      {cols: 20, rows: 20, y: 0, x: 0}, // Cesium app
      {cols: 0, rows: 0, y: 0, x: 0} // Status View
    ]
  };
  private _fullscreenActive: boolean;

  // ==============================
  // THEME
  // ==============================
  private _darkTheme: boolean;

  // ==============================
  // LOCAL STORAGE
  // ==============================
  public static readonly STORAGE_NAME: StorageNameConfig = {
    workspace: 'workspace'
  };
  public static readonly STRING_ENCODING: string = 'utf16';

  // ==============================
  // CESIUM
  // ==============================
  private _cameraLocation: CesiumCameraLocation;
  public static readonly DEFAULT_CAMERA_LOCATION: CesiumCameraLocation = {
    "latitude": 35.1518351540856,
    "longitude": -82.50000000000001,
    "height": 12673564.865952782,
    "heading": 360,
    "pitch": -89.90960661587086,
    "roll": 0
  };

  private _geocoder: GeocoderConfig;
  public static readonly DEFAULT_GEOCODER: GeocoderConfig = {
    autocomplete: true,
    geocoderServices: [
      // Used to search `longitude latitude (height)`
      // with longitude/latitude in degrees and height in meters, should always be enabled
      GeocoderService.CARTOGRAPHIC,
      // Nominatim OpenStreetMap by default
      GeocoderService.NOMINATIM
    ]
  };

  // Texts taken from
  // https://github.com/CesiumGS/cesium/blob/main/Source/Widgets/BaseLayerPicker/createDefaultImageryProviderViewModels.js
  private _imageryLayerIndex: number;
  public static readonly DEFAULT_CESIUM_IMAGERY_LAYER_COLLECTION_INFO: CesiumImageryLayerCollectionInfo = {
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
  public static readonly DEFAULT_IMAGERY_LAYER: CesiumImageryLayerInfo =
    Workspace.DEFAULT_CESIUM_IMAGERY_LAYER_COLLECTION_INFO.ESRI_WORLD_IMAGERY;

  // ==============================
  // OTHERS
  // ==============================
  public static ADD_SPLASH_WINDOW_MODEL: SplashWindowModel = {
    url: "",
    showOnStart: true
  };

  constructor(
    title?: string,
    description?: string,
    maintainer?: string,
    modelLayers?: Array<ModelLayer>,
    baseLayers?: Array<BaseLayer>,
    terrainLayers?: Array<TerrainLayer>,
    timeline?: TimeLineConfig,
    viewpoints?: Array<Viewpoint>,
    gridLayout?: Array<GridsterItem>,
    fullscreenActive?: boolean,
    darkTheme?: boolean,
    cameraLocation?: CesiumCameraLocation,
    geocoder?: GeocoderConfig,
    imageryLayerIndex?: number
  ) {
    this._title = (title == null) ? "Workspace title" : title;
    this._description = (description == null) ? "Workspace description" : description;
    this._maintainer = (maintainer == null) ? "Workspace maintainer" : maintainer;
    this._modelLayers = (modelLayers == null) ? [] : modelLayers;
    this._baseLayers = (baseLayers == null) ? [] : baseLayers;
    this._terrainLayers = (terrainLayers == null) ? [] : terrainLayers;
    this._timeline = (timeline == null) ? Workspace.DEFAULT_TIMELINE : timeline;
    this._viewpoints = (viewpoints == null) ? [] : viewpoints;
    this._gridLayout = (gridLayout == null) ? Workspace.DEFAULT_LAYOUTS.layoutCenterGlobe : gridLayout;
    this._fullscreenActive = (fullscreenActive == null) ? false : fullscreenActive;
    this._darkTheme = (darkTheme == null) ? false : darkTheme;
    this._cameraLocation = (cameraLocation == null) ? Workspace.DEFAULT_CAMERA_LOCATION : cameraLocation;
    this._geocoder = (geocoder == null) ? Workspace.DEFAULT_GEOCODER : geocoder;
    this._imageryLayerIndex = (imageryLayerIndex == null) ? Workspace.DEFAULT_IMAGERY_LAYER.index : imageryLayerIndex;
  }

  public static initFrom(workspace: Workspace) {
    return Object.assign(new Workspace(), workspace);
  }

  /**
   * Compare a given layout with the defaults and return `left`, `center`, `right` or `undefined`.
   *
   * @param layout
   */
  public static getLayout(layout: GridsterItem[]): string | undefined {
    if (_.isEqual(Workspace.DEFAULT_LAYOUTS.layoutLeftGlobe, layout)) {
      return 'left';
    }
    if (_.isEqual(Workspace.DEFAULT_LAYOUTS.layoutCenterGlobe, layout)) {
      return 'center';
    }
    if (_.isEqual(Workspace.DEFAULT_LAYOUTS.layoutRightGlobe, layout)) {
      return 'right';
    }
    return undefined;
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  // ==============================
  // GETTER
  // ==============================
  get about(): AboutConfig {
    return this._about;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get maintainer(): string {
    return this._maintainer;
  }

  get modelLayers(): Array<ModelLayer> {
    return this._modelLayers;
  }

  get baseLayers(): Array<BaseLayer> {
    return this._baseLayers;
  }

  get terrainLayers(): Array<TerrainLayer> {
    return this._terrainLayers;
  }

  get timeline(): TimeLineConfig {
    return this._timeline;
  }

  get viewpoints(): Array<Viewpoint> {
    return this._viewpoints;
  }

  get gridLayout(): Array<GridsterItem> {
    return this._gridLayout;
  }

  get fullscreenActive(): boolean {
    return this._fullscreenActive;
  }

  get darkTheme(): boolean {
    return this._darkTheme;
  }

  get cameraLocation(): CesiumCameraLocation {
    return this._cameraLocation;
  }

  get geocoder(): GeocoderConfig {
    return this._geocoder;
  }

  get imageryLayerIndex(): number {
    return this._imageryLayerIndex;
  }

  // ==============================
  // SETTER
  // ==============================
  set title(value: string) {
    this._title = value;
  }

  set description(value: string) {
    this._description = value;
  }

  set maintainer(value: string) {
    this._maintainer = value;
  }

  set modelLayers(value: Array<ModelLayer>) {
    this._modelLayers = value;
  }

  set baseLayers(value: Array<BaseLayer>) {
    this._baseLayers = value;
  }

  set terrainLayers(value: Array<TerrainLayer>) {
    this._terrainLayers = value;
  }

  set timeline(value: TimeLineConfig) {
    this._timeline = value;
  }

  set viewpoints(value: Array<Viewpoint>) {
    this._viewpoints = value;
  }

  set gridLayout(value: Array<GridsterItem>) {
    this._gridLayout = value;
  }

  set fullscreenActive(value: boolean) {
    this._fullscreenActive = value;
  }

  set darkTheme(value: boolean) {
    this._darkTheme = value;
  }

  set cameraLocation(value: CesiumCameraLocation) {
    this._cameraLocation = value;
  }

  set geocoder(value: GeocoderConfig) {
    this._geocoder = value;
  }

  set imageryLayerIndex(value: number) {
    this._imageryLayerIndex = value;
  }
}

interface AboutConfig {
  software: string,
  version: string,
  url: URL,
  repositories: {
    github: URL
  },
  developer: {
    name: string,
    organization: string,
    url: URL
  }
}

export interface TimeLineConfig {
  autoplay: boolean,
  current: Date,
  multiplier: SpeedMultipliers,
  range: DatePickerTimeRange | undefined;
}

export interface GridLayouts {
  layoutLeftGlobe: Array<GridsterItem>,
  layoutCenterGlobe: Array<GridsterItem>,
  layoutRightGlobe: Array<GridsterItem>,
  layoutFullscreen: Array<GridsterItem>
}

export interface StorageNameConfig {
  workspace: string
}

interface GeocoderConfig {
  autocomplete: boolean,
  geocoderServices: Array<GeocoderService>
}

export interface CesiumImageryLayerInfo {
  index: number,
  name: string,
  iconUrl: string,
  tooltip: string,
  category: string
}

interface CesiumImageryLayerCollectionInfo {
  BING_MAPS_AERIAL: CesiumImageryLayerInfo,
  BING_MAPS_AERIAL_WITH_LABELS: CesiumImageryLayerInfo,
  BING_MAPS_ROADS: CesiumImageryLayerInfo,
  ESRI_WORLD_IMAGERY: CesiumImageryLayerInfo,
  ESRI_WORLD_STREETMAP: CesiumImageryLayerInfo,
  ESRI_NATIONAL_GEOGRAPHIC: CesiumImageryLayerInfo,
  OPEN_STREET_MAP: CesiumImageryLayerInfo,
  STAMEN_WATERCOLOR: CesiumImageryLayerInfo,
  STAMEN_TONER: CesiumImageryLayerInfo,
  SENTINEL_2: CesiumImageryLayerInfo,
  BLUE_MARBLE: CesiumImageryLayerInfo,
  EARTH_AT_NIGHT: CesiumImageryLayerInfo,
  NATURAL_EARTH_II: CesiumImageryLayerInfo
}

export interface SplashWindowModel {
  url: string;
  showOnStart: boolean;
}
