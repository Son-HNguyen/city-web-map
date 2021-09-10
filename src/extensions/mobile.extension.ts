/* eslint-disable no-underscore-dangle */
/*
 *
 *  * City Web Map
 *  * http://www.3dcitydb.org/
 *  *
 *  * Copyright 2015 - 2021
 *  * Chair of Geoinformatics
 *  * Department of Aerospace and Geodesy
 *  * Technical University of Munich, Germany
 *  * https://www.gis.lrg.tum.de/
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

import {GpsExtension} from './gps.extension';
import {UtilityService} from "../services/utils.service";
import {AppModule} from "../app/app.module";
import {Injectable} from "@angular/core";
import {GlobalService} from "../services/global.service";
import {Workspace} from "../core/Workspace";

@Injectable()
export class MobileExtension {
  // GPS functionalities, including geolocation and device orientation
  private _gps: GpsExtension;
  private GLOBALS: GlobalService;
  private UTILS: UtilityService;

  constructor() {
    this.UTILS = AppModule.injector.get(UtilityService);
    this.GLOBALS = AppModule.injector.get(GlobalService);
    this._gps = new GpsExtension(true);

    this.setDistanceLegend();
    this.setLoadingIndicator();

    this.hideCredits();
    this.hideNavigationDiv();
    this.hideInspector();

    this.setInfoboxFullscreen();
    this.setToolboxFullscreen();
    this.setSplashWindowFullscreen();
  }

  /**
   * Set distance legend to display on the bottom right corner on mobile devices.
   */
  private setDistanceLegend(): void {
    const loop = window.setInterval(() => {
      const distanceLegend = document.getElementsByClassName('distance-legend')[0];
      if (distanceLegend != null) {
        distanceLegend.classList.remove('distance-legend');
        distanceLegend.classList.add('distance-legend-mobile');
        clearInterval(loop);
      }
    }, 10);
  };

  /**
   * Set loading indicator on mobile devices.
   */
  private setLoadingIndicator(): void {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator != null) {
      loadingIndicator.classList.remove('loadingIndicator');
      loadingIndicator.classList.add('loadingIndicator-mobile');

      for (let i = 1; i <= 4; i++) {
        const rect = document.createElement('div');
        rect.className = 'rect' + i;
        loadingIndicator.appendChild(rect);
      }
    }
  };

  /**
   * Hide credit logos and texts.
   */
  private hideCredits(): void {
    const textViewer = document.getElementsByClassName('cesium-widget-credits')[0];
    if (textViewer != null && textViewer.parentNode != null) {
      textViewer.parentNode.removeChild(textViewer);
    }
  };

  /**
   * Hide navigation tools (compass + zooming).
   */
  private hideNavigationDiv(): void {
    const loop = window.setInterval(() => {
      const navDiv = document.getElementById('navigationDiv');
      if (navDiv != null && navDiv.parentNode != null) {
        navDiv.parentNode.removeChild(navDiv);
        clearInterval(loop);
      }
    }, 10);
  };

  /**
   * Hide inspector that shows number of cached and loaded tiles.
   */
  private hideInspector(): void {
    const loadingImg = document.getElementById('citydb_loadingTilesInspector');
    const cachedTiles = document.getElementById('citydb_cachedTilesInspector');
    const showedTiles = document.getElementById('citydb_showedTilesInspector');

    if (loadingImg != null && loadingImg.parentNode != null && cachedTiles != null && showedTiles != null) {
      const parentNode = loadingImg.parentNode;
      parentNode.removeChild(loadingImg);
      const loadingTileIndicator = document.createElement('div');
      loadingTileIndicator.id = 'citydb_loadingTilesInspector';
      loadingTileIndicator.className = 'loadingIndicator-tile-mobile';
      parentNode.appendChild(loadingTileIndicator);

      cachedTiles.style.display = 'none';

      showedTiles.style.display = 'none';
    }
  };

  /**
   * Set infobox containing thematic values to fullscreen on mobile devices.
   */
  private setInfoboxFullscreen(): void {
    const scope = this;

    const infobox = document.getElementsByClassName('cesium-infoBox')[0];
    infobox.classList.add('infobox-full');
    if (this.UTILS.os.getMobileOS() === 'iOS') {
      infobox.classList.add('infobox-full-ios');
    }
  };

  /**
   * Set toolbox to fullscreen on mobile devices.
   */
  private setToolboxFullscreen(): void {
    const scope = this;

    const uiMenu = document.getElementById('uiMenu-content');
    const toolbox = document.getElementById('citydb_toolbox');
    if (uiMenu != null && toolbox != null) {
      uiMenu.style.display = 'block';
      uiMenu.classList.add('uiMenu-full');
      if (this.UTILS.os.getMobileOS() === 'iOS') {
        uiMenu.classList.add('uiMenu-full-ios');
      }

      toolbox.classList.add('toolbox-full');
    }
  };

  /**
   * Set splash window to fullscreen on mobile devices.
   */
  private setSplashWindowFullscreen(): void {
    const scope = this;

    const splashWindow = document.getElementById('splashwindow_iframe');
    if (splashWindow != null) {
      splashWindow.classList.add('splash-wrapper-mobile');
      if (this.UTILS.os.getMobileOS() === 'iOS') {
        splashWindow.classList.add('splash-wrapper-mobile-ios');
      }

      const closeIgnoreButtons = document.getElementsByClassName('splashscreen-buttons')[0];
      closeIgnoreButtons.classList.add('splashscreen-buttons-mobile');

      // Simplify contents of the splash window
      const mobileContentUrl = 'splash/SplashWindow_Mobile.html';

      const fs = require('fs');
      fs.access(mobileContentUrl, fs.F_OK, (err: any) => {
        if (err) {
          console.error(err);
          return;
        }
        // File exists
        // Mobile version for the contents of the splash window exists
        const splashWindowIframeContent: any = document.getElementById('splashwindow_iframe_content');
        if (splashWindowIframeContent != null) {
          splashWindowIframeContent.src = mobileContentUrl;
          Workspace.ADD_SPLASH_WINDOW_MODEL.url = mobileContentUrl;
        }
      });
    }
  };

  /**
   * Set the max width and height of Cesium's error dialog to fit to the screen estate on mobile devices.
   */
  private setDialogSize(): void {
    const dialogDiv = document.getElementsByClassName('cesium-widget-errorPanel-content')[0];
    if (dialogDiv != null) {
      dialogDiv.classList.add('cesium-widget-errorPanel-content-mobile');
    }
  };

  get gps(): GpsExtension {
    return this._gps;
  }

  set gps(value: GpsExtension) {
    this._gps = value;
  }
}
