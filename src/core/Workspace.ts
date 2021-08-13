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
import _ = require("lodash");

export class Workspace {
  // ==============================
  // METADATA
  // ==============================
  private _title: string;
  private _description: string;
  private _maintainer: string;

  // ==============================
  // MODEL LAYERS
  // ==============================
  private _modelLayers: Array<ModelLayer>;
  private _baseLayers: Array<BaseLayer>;
  private _terrainLayers: Array<TerrainLayer>;

  // ==============================
  // WIDGETS
  // ==============================
  private _viewpoints: Array<Viewpoint>;

  // ==============================
  // LAYOUT
  // ==============================
  private _gridLayout: Array<GridsterItem>;
  public static readonly DEFAULT_LAYOUTS: GridLayouts = {
    layoutLeftGlobe: [
      {cols: 20, rows: 1, y: 0, x: 0}, // Menu bar
      {cols: 12, rows: 2, y: 1, x: 0}, // Nav
      {cols: 12, rows: 2, y: 19, x: 0}, // Status
      {cols: 5, rows: 10, y: 1, x: 12}, // Info
      {cols: 5, rows: 10, y: 11, x: 12}, // View list
      {cols: 3, rows: 5, y: 1, x: 17}, // Layer list
      {cols: 3, rows: 12, y: 6, x: 17}, // Context menu
      {cols: 3, rows: 3, y: 18, x: 17}, // Menu
      {cols: 12, rows: 16, y: 3, x: 0} // Cesium app
    ],
    layoutCenterGlobe: [
      {cols: 20, rows: 1, y: 0, x: 0}, // Menu bar
      {cols: 3, rows: 5, y: 1, x: 0}, // Layer list
      {cols: 3, rows: 12, y: 6, x: 0}, // Context menu
      {cols: 3, rows: 3, y: 18, x: 0}, // Menu
      {cols: 12, rows: 2, y: 1, x: 3}, // Nav
      {cols: 5, rows: 10, y: 1, x: 15}, // Info
      {cols: 5, rows: 10, y: 11, x: 15}, // View list
      {cols: 12, rows: 2, y: 19, x: 3}, // Status
      {cols: 12, rows: 16, y: 3, x: 3} // Cesium app
    ],
    layoutRightGlobe: [
      {cols: 20, rows: 1, y: 0, x: 0}, // Menu bar
      {cols: 3, rows: 5, y: 1, x: 0}, // Layer list
      {cols: 3, rows: 12, y: 6, x: 0}, // Context menu
      {cols: 3, rows: 3, y: 18, x: 0}, // Menu
      {cols: 5, rows: 10, y: 1, x: 3}, // Info
      {cols: 5, rows: 10, y: 11, x: 3}, // View list
      {cols: 12, rows: 2, y: 1, x: 8}, // Nav
      {cols: 12, rows: 2, y: 19, x: 8}, // Status
      {cols: 12, rows: 16, y: 3, x: 8} // Cesium app
    ],
    layoutFullscreen: [
      {cols: 0, rows: 0, y: 0, x: 0}, // Menu bar
      {cols: 0, rows: 0, y: 0, x: 0}, // Layer list
      {cols: 0, rows: 0, y: 0, x: 0}, // Context menu
      {cols: 0, rows: 0, y: 0, x: 0}, // Menu
      {cols: 0, rows: 0, y: 0, x: 0}, // Nav
      {cols: 0, rows: 0, y: 0, x: 0}, // Info
      {cols: 0, rows: 0, y: 0, x: 0}, // View list
      {cols: 0, rows: 0, y: 0, x: 0}, // Status
      {cols: 20, rows: 21, y: 0, x: 0} // Cesium app
    ]
  };
  private _itemPos: GridItemPos; // Index position of gridster items within a dashboard array
  public static readonly DEFAULT_ITEM_POS_LAYOUTS: GridItemPositions = {
    layoutLeftGlobe: {
      menuBar: 0,
      nav: 1,
      status: 2,
      info: 3,
      viewList: 4,
      layerList: 5,
      menuContext: 6,
      menu: 7,
      globe: 8
    },
    layoutCenterGlobe: {
      menuBar: 0,
      layerList: 1,
      menuContext: 2,
      menu: 3,
      nav: 4,
      info: 5,
      viewList: 6,
      status: 7,
      globe: 8
    },
    layoutRightGlobe: {
      menuBar: 0,
      layerList: 1,
      menuContext: 2,
      menu: 3,
      info: 4,
      viewList: 5,
      nav: 6,
      status: 7,
      globe: 8
    }
  };

  // ==============================
  // COOKIES
  // ==============================
  public static readonly COOKIE_EXPIRE: number = 7;
  public static readonly COOKIE_NAMES: CookieNamesConfig = {
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
    viewpoints?: Array<Viewpoint>,
    gridLayout?: Array<GridsterItem>,
    itemPos?: GridItemPos,
    cameraLocation?: CesiumCameraLocation,
  ) {
    this._title = (title == null) ? "Workspace title" : title;
    this._description = (description == null) ? "Workspace description" : description;
    this._maintainer = (maintainer == null) ? "Workspace maintainer" : maintainer;
    this._modelLayers = (modelLayers == null) ? [] : modelLayers;
    this._baseLayers = (baseLayers == null) ? [] : baseLayers;
    this._terrainLayers = (terrainLayers == null) ? [] : terrainLayers;
    this._viewpoints = (viewpoints == null) ? [] : viewpoints;
    this._gridLayout = (gridLayout == null) ? Workspace.DEFAULT_LAYOUTS.layoutCenterGlobe : gridLayout;
    this._itemPos = (itemPos == null) ? Workspace.DEFAULT_ITEM_POS_LAYOUTS.layoutCenterGlobe : itemPos;
    this._cameraLocation = (cameraLocation == null) ? Workspace.DEFAULT_CAMERA_LOCATION : cameraLocation;
  }

  public static initFrom(workspace: Workspace) {
    let result = Object.assign(new Workspace(), workspace);
    return result;
  }

  /**
   * Compare a given layout with the defaults and return `left`, `center`, `right` or `undefined`.
   *
   * @param GridsterItem
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

  get viewpoints(): Array<Viewpoint> {
    return this._viewpoints;
  }

  get gridLayout(): Array<GridsterItem> {
    return this._gridLayout;
  }

  get itemPos(): GridItemPos {
    return this._itemPos;
  }

  get cameraLocation(): CesiumCameraLocation {
    return this._cameraLocation;
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

  set viewpoints(value: Array<Viewpoint>) {
    this._viewpoints = value;
  }

  set gridLayout(value: Array<GridsterItem>) {
    this._gridLayout = value;
  }

  set itemPos(value: GridItemPos) {
    this._itemPos = value;
  }

  set cameraLocation(value: CesiumCameraLocation) {
    this._cameraLocation = value;
  }
}

export interface GridLayouts {
  layoutLeftGlobe: Array<GridsterItem>,
  layoutCenterGlobe: Array<GridsterItem>,
  layoutRightGlobe: Array<GridsterItem>,
  layoutFullscreen: Array<GridsterItem>
}

export interface GridItemPositions {
  layoutLeftGlobe: GridItemPos,
  layoutCenterGlobe: GridItemPos,
  layoutRightGlobe: GridItemPos
}

export interface GridItemPos {
  menuBar: number,
  layerList: number,
  menuContext: number,
  menu: number,
  nav: number,
  info: number,
  viewList: number,
  status: number,
  globe: number
}

export interface CookieNamesConfig {
  workspace: string
}

export interface SplashWindowModel {
  url: string;
  showOnStart: boolean;
}
