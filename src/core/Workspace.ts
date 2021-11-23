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
import {ImageryLayer} from "./ImageryLayer";
import {TerrainLayer} from "./TerrainLayer";
import {Viewpoint} from "./Viewpoint";
import {GridsterItem} from "angular-gridster2";
import {DatePickerTimeRange, SpeedMultipliers} from "../app/timeline/timeline.component";
import {isEqual} from "lodash";
import {CameraLocation, GeocoderService, GlobeEngine} from "../globe/Globe";

export class Workspace {
  // ==============================
  // ABOUT
  // ==============================
  private readonly _about: AboutType = {
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
  private _baseLayers: Array<ImageryLayer>;
  private _terrainLayers: Array<TerrainLayer>;

  // ==============================
  // WIDGETS
  // ==============================
  private _timeline: TimeLineType;
  private _viewpoints: Array<Viewpoint>;

  // ==============================
  // LAYOUT
  // ==============================
  private _gridLayout: GridLayoutType;
  // Gridlayout in 20 X 20
  public static readonly DEFAULT_LAYOUT: GridLayoutType = {
    menuBar: {
      index: 0,
      layout: {
        cols: 20,
        rows: 1,
        x: 0,
        y: 0,
        dragEnabled: false,
        resizeEnabled: false
      }
    },
    workspaceView: {
      index: 1,
      layout: {
        cols: 3,
        rows: 9,
        x: 0,
        y: 1,
        dragEnabled: false,
        minItemCols: 0,
        maxItemCols: 10,
        minItemRows: 3,
        maxItemRows: 15
      }
    },
    detailView: {
      index: 2,
      layout: {
        cols: 3,
        rows: 9,
        x: 0,
        y: 10,
        dragEnabled: false,
        minItemCols: 0,
        maxItemCols: 10,
        minItemRows: 3,
        maxItemRows: 15
      }
    },
    infoView: {
      index: 3,
      layout: {
        cols: 3,
        rows: 18,
        x: 17,
        y: 1,
        dragEnabled: false,
        minItemCols: 0,
        maxItemCols: 10,
        minItemRows: 18,
        maxItemRows: 18
      }
    },
    statusView: {
      index: 4,
      layout: {
        cols: 20,
        rows: 1,
        x: 0,
        y: 19,
        dragEnabled: false,
        resizeEnabled: false
      }
    },
    globe: {
      index: 5,
      layout: {
        cols: 14,
        rows: 18,
        x: 3,
        y: 1,
        dragEnabled: false,
        minItemCols: 10,
        maxItemCols: 20,
        minItemRows: 18,
        maxItemRows: 20
      }
    }
  };
  private _fullscreenActive: boolean;

  // ==============================
  // THEME
  // ==============================
  private _darkTheme: boolean;

  // ==============================
  // LOCAL STORAGE
  // ==============================
  public static readonly STORAGE_NAME: StorageNameType = {
    workspace: 'workspace'
  };
  public static readonly STRING_ENCODING: string = 'utf16';

  // ==============================
  // GLOBE
  // ==============================
  private _globeEngine: GlobeEngine;
  public static readonly DEFAULT_GLOBE_ENGINE = GlobeEngine.CESIUM; // TODO Add a setting to select Cesium as an option

  private _cameraLocation: CameraLocation;
  public static readonly DEFAULT_CAMERA_LOCATION: CameraLocation = {
    "latitude": 35.1518351540856,
    "longitude": -82.50000000000001,
    "height": 12673564.865952782,
    "heading": 360,
    "pitch": -89.90960661587086,
    "roll": 0
  };
  private _geocoder: GeocoderType;
  public static readonly DEFAULT_GEOCODER = {
    autocomplete: true,
    geocoderServices: [
      // Used to search `longitude latitude (height)`
      // with longitude/latitude in degrees and height in meters, should always be enabled
      GeocoderService.CARTOGRAPHIC,
      // Nominatim OpenStreetMap by default
      GeocoderService.NOMINATIM
    ]
  };

  private _imageryLayerIndex: number;

  // ==============================
  // OTHERS
  // ==============================
  // TODO Check ADD_SPLASH_WINDOW_MODEL
  public static ADD_SPLASH_WINDOW_MODEL: SplashWindowModel = {
    url: "",
    showOnStart: true
  };

  constructor(
    title?: string,
    description?: string,
    maintainer?: string,
    globeEngine?: GlobeEngine,
    modelLayers?: Array<ModelLayer>,
    baseLayers?: Array<ImageryLayer>,
    terrainLayers?: Array<TerrainLayer>,
    timeline?: TimeLineType,
    viewpoints?: Array<Viewpoint>,
    gridLayout?: GridLayoutType,
    fullscreenActive?: boolean,
    darkTheme?: boolean,
    cameraLocation?: CameraLocation,
    geocoder?: GeocoderType,
    imageryLayerIndex?: number
  ) {
    this._title = (title == null) ? "Workspace title" : title;
    this._description = (description == null) ? "Workspace description" : description;
    this._maintainer = (maintainer == null) ? "Workspace maintainer" : maintainer;
    this._globeEngine = (globeEngine == null) ? GlobeEngine.CESIUM : globeEngine;
    this._modelLayers = (modelLayers == null) ? [] : modelLayers;
    this._baseLayers = (baseLayers == null) ? [] : baseLayers;
    this._terrainLayers = (terrainLayers == null) ? [] : terrainLayers;
    this._timeline = (timeline == null) ?
      {
        autoplay: false,
        current: new Date(),
        multiplier: SpeedMultipliers.NORMAL,
        range: undefined
      }
      : timeline;
    this._viewpoints = (viewpoints == null) ? [] : viewpoints;
    this._gridLayout = (gridLayout == null) ? Workspace.DEFAULT_LAYOUT : gridLayout;
    this._fullscreenActive = (fullscreenActive == null) ? false : fullscreenActive;
    this._darkTheme = (darkTheme == null) ? false : darkTheme;
    this._cameraLocation = (cameraLocation == null) ? Workspace.DEFAULT_CAMERA_LOCATION : cameraLocation;
    this._geocoder = (geocoder == null) ? Workspace.DEFAULT_GEOCODER : geocoder;
    // Imagery layer index = -1 means not yet set
    // and will be set later by calling updateImageryLayerIndex() depending on the type of globe engine
    this._imageryLayerIndex = (imageryLayerIndex == null) ? -1 : imageryLayerIndex;
  }

  // Init and type check
  public static initFrom(workspaceString: string | null): Workspace | undefined {
    let workspace = {};
    try {
      if (workspaceString == null || workspaceString.trim().length === 0) {
        throw new Error();
      } else {
        workspace = Object.assign(new Workspace(), JSON.parse(workspaceString));
        // TODO Type check JSON string vs Workspace
        if (workspace instanceof Workspace) {
          return workspace;
        }
        throw new Error();
      }
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Compare a given layout with the defaults and return `left`, `center`, `right` or `undefined`.
   *
   * @param layout
   */
  public static isLayoutDefault(layout: GridLayoutType): boolean {
    return isEqual(Workspace.DEFAULT_LAYOUT, layout);
  }

  /**
   * Like a setter but only update if the previous value is -1,
   * which means the property has never been set before.
   *
   * @param index
   */
  public updateImageryLayerIndex(index: number): void {
    if (this.imageryLayerIndex == -1) {
      this.imageryLayerIndex = index;
    }
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  // ==============================
  // GETTER
  // ==============================
  get about(): AboutType {
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

  get globeEngine(): GlobeEngine {
    return this._globeEngine;
  }

  get modelLayers(): Array<ModelLayer> {
    return this._modelLayers;
  }

  get baseLayers(): Array<ImageryLayer> {
    return this._baseLayers;
  }

  get terrainLayers(): Array<TerrainLayer> {
    return this._terrainLayers;
  }

  get timeline(): TimeLineType {
    return this._timeline;
  }

  get viewpoints(): Array<Viewpoint> {
    return this._viewpoints;
  }

  get gridLayout(): GridLayoutType {
    return this._gridLayout;
  }

  get fullscreenActive(): boolean {
    return this._fullscreenActive;
  }

  get darkTheme(): boolean {
    return this._darkTheme;
  }

  get cameraLocation(): CameraLocation {
    return this._cameraLocation;
  }

  get geocoder(): GeocoderType {
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

  set globeEngine(value: GlobeEngine) {
    this._globeEngine = value;
  }

  set modelLayers(value: Array<ModelLayer>) {
    this._modelLayers = value;
  }

  set baseLayers(value: Array<ImageryLayer>) {
    this._baseLayers = value;
  }

  set terrainLayers(value: Array<TerrainLayer>) {
    this._terrainLayers = value;
  }

  set timeline(value: TimeLineType) {
    this._timeline = value;
  }

  set viewpoints(value: Array<Viewpoint>) {
    this._viewpoints = value;
  }

  set gridLayout(value: GridLayoutType) {
    this._gridLayout = value;
  }

  set fullscreenActive(value: boolean) {
    this._fullscreenActive = value;
  }

  set darkTheme(value: boolean) {
    this._darkTheme = value;
  }

  set cameraLocation(value: CameraLocation) {
    this._cameraLocation = value;
  }

  set geocoder(value: GeocoderType) {
    this._geocoder = value;
  }

  set imageryLayerIndex(value: number) {
    this._imageryLayerIndex = value;
  }
}

interface AboutType {
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

export interface TimeLineType {
  autoplay: boolean,
  current: Date,
  multiplier: SpeedMultipliers,
  range: DatePickerTimeRange | undefined;
}

// TODO Convention: Rename all interface names to ...Type?
export interface GridLayoutType {
  menuBar: IndexedGridItemType,
  workspaceView: IndexedGridItemType,
  detailView: IndexedGridItemType,
  infoView: IndexedGridItemType,
  statusView: IndexedGridItemType,
  globe: IndexedGridItemType
}

interface IndexedGridItemType {
  index: number,
  layout: GridsterItem
}

export interface StorageNameType {
  workspace: string
}


export interface SplashWindowModel {
  url: string;
  showOnStart: boolean;
}

export interface GeocoderType {
  autocomplete: boolean,
  geocoderServices: Array<GeocoderService>
}
