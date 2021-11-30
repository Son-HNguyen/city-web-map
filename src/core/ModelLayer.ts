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
  private _url: URL;
  private _name: string;
  private _description: string;

  constructor(options: ModelLayerOptionsType) {
    this._url = options.url;
    this._name = options.name;
    this._description = options.description;
  }

  public abstract addToGlobe(): Promise<void>;

  get url(): URL {
    return this._url;
  }

  set url(value: URL) {
    this._url = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }
}

export interface ModelLayerOptionsType {
  url: URL,
  name: string,
  description: string
}
