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
import {CesiumCameraPosition} from "../utilities/camera.utility";
import {UtilityService} from "../utils.service";

export class Workspace {
  public static current: Workspace;

  private _title: string;
  private _description: string;
  private _maintainer: string;
  private _modelLayers: Array<ModelLayer>;
  private _baseLayers: Array<BaseLayer>;
  private _terrainLayers: Array<TerrainLayer>;
  private _viewpoints: Array<Viewpoint>;
  private _lastLocation: CesiumCameraPosition | undefined;

  constructor(
    title: string,
    description: string,
    maintainer: string,
    modelLayers: Array<ModelLayer>,
    baseLayers: Array<BaseLayer>,
    terrainLayers: Array<TerrainLayer>,
    viewpoints: Array<Viewpoint>,
    lastLocation?: CesiumCameraPosition,
    private UTILS?: UtilityService) {
    this._title = title;
    this._description = description;
    this._maintainer = maintainer
    this._modelLayers = modelLayers;
    this._baseLayers = baseLayers;
    this._terrainLayers = terrainLayers;
    this._viewpoints = viewpoints;
    this._lastLocation = (lastLocation == null) ? undefined : lastLocation;
  }

  public updateLocation(): void {
    this._lastLocation = this.UTILS!.camera.getCurrentPosition();
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get maintainer(): string {
    return this._maintainer;
  }

  set maintainer(value: string) {
    this._maintainer = value;
  }

  get modelLayers(): Array<ModelLayer> {
    return this._modelLayers;
  }

  set modelLayers(value: Array<ModelLayer>) {
    this._modelLayers = value;
  }

  get baseLayers(): Array<BaseLayer> {
    return this._baseLayers;
  }

  set baseLayers(value: Array<BaseLayer>) {
    this._baseLayers = value;
  }

  get terrainLayers(): Array<TerrainLayer> {
    return this._terrainLayers;
  }

  set terrainLayers(value: Array<TerrainLayer>) {
    this._terrainLayers = value;
  }

  get viewpoints(): Array<Viewpoint> {
    return this._viewpoints;
  }

  set viewpoints(value: Array<Viewpoint>) {
    this._viewpoints = value;
  }

  get lastLocation(): CesiumCameraPosition | undefined {
    return this._lastLocation;
  }

  set lastLocation(value: CesiumCameraPosition | undefined) {
    this._lastLocation = value;
  }
}
