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

export abstract class ModelLayer {
  private _name: string;
  private _type: LayerTypes;
  private _url: URL;
  private _tags: Array<string>;
  private _description: string;
  private _activated: boolean; // Whether this layer should be activated in the globe

  constructor(options: ModelLayerOptionsType) {
    this._name = options.name;
    this._type = options.type;
    this._url = options.url;
    this._tags = options.tags;
    this._description = options.description;
    this._activated = false;
  }

  // The input URL must already be valid
  public abstract addToGlobe(): Promise<void>;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get type(): LayerTypes {
    return this._type;
  }

  set type(value: LayerTypes) {
    this._type = value;
  }

  get url(): URL {
    return this._url;
  }

  set url(value: URL) {
    this._url = value;
  }

  get tags(): Array<string> {
    return this._tags;
  }

  set tags(value: Array<string>) {
    this._tags = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get activated(): boolean {
    return this._activated;
  }

  set activated(value: boolean) {
    this._activated = value;
  }
}

export interface ModelLayerOptionsType {
  name: string,
  type: LayerTypes,
  url: URL,
  tags: Array<string>,
  description: string
}

export enum LayerTypes {
  KML = 'kml',
  CITYDB_TILES = 'citydb',
  CESIUM_3D_TILES = 'cesium'
}
