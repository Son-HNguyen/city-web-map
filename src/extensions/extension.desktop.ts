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

export class ExtensionDesktop {

  constructor() {
    this.adjustNavigationDiv();
  }

  private adjustNavigationDiv(): void {
    let scope = this;

    // bring the navigation div to the background
    let loop1 = window.setInterval(function () {
      const navDiv = document.getElementById("navigationDiv");
      if (navDiv != null) {
        navDiv.style.zIndex = "0";
        clearInterval(loop1);
      }
    }, 10);

    // bring the infobox to the foreground
    let loop2 = window.setInterval(function () {
      const infobox = document.getElementsByClassName("cesium-infoBox cesium-infoBox-visible")[0];
      if (infobox != null) {
        (<HTMLElement>infobox).style.zIndex = "1000";
        clearInterval(loop2);
      }
    }, 10);
  }
}
