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

import * as Cesium from 'cesium';
import {UtilityService} from "../utils.service";
import {Injectable} from "@angular/core";
import {AppModule} from "../app/app.module";
import {GlobalService} from "../global.service";

/**
 * GPS Geolocation with device orientation in real-time.
 */
export class GpsExtension {
  private _liveTrackingActivated: boolean;
  private _timer: any;
  private _timerMilliseconds: number; // duration between clicks in ms
  private _savedAlpha: number;
  private _firstActivated: boolean;
  private _watchPos: boolean;
  private _touchHoldDuration: number; // touch press duration in ms
  private _longPress: boolean;
  private _isMobile: boolean;

  constructor(isMobile: boolean, private GLOBALS?: GlobalService, private UTILS?: UtilityService) {
    this._liveTrackingActivated = false;
    this._timer = undefined;
    this._timerMilliseconds = 350;
    this._savedAlpha = 0;
    this._firstActivated = false;
    this._watchPos = false;
    this._touchHoldDuration = 500;
    this._longPress = false;
    this._isMobile = isMobile;
    this.createGPSButton();
  }

  private createGPSButton(): void {
    const scope = this;

    const button = document.getElementById('gpsButton');
    if (button == null) {
      return;
    }
    button.className = 'cesium-button cesium-toolbar-button tracking-deactivated';
    button.title = 'View GPS (single-click: one time, double-click: real-time)';

    // replace the 3D/2D button with this GPS button
    const customCesiumViewerToolbar = document.getElementsByClassName('cesium-viewer-toolbar')[0];
    const customGlobeButton = customCesiumViewerToolbar.getElementsByClassName('cesium-sceneModePicker-wrapper cesium-toolbar-button')[0];
    customCesiumViewerToolbar.replaceChild(button, customGlobeButton);

    if (scope._isMobile) {
      // remove home button
      const customHomeButton =
        customCesiumViewerToolbar.getElementsByClassName('cesium-button cesium-toolbar-button cesium-home-button')[0];
      customCesiumViewerToolbar.removeChild(customHomeButton);

      // remove info button
      // var customInfoButton = customCesiumViewerToolbar.getElementsByClassName("cesium-navigationHelpButton-wrapper")[0];
      // customCesiumViewerToolbar.removeChild(customInfoButton);
    }

    // --------------------------MOUSE HELD EVENT--------------------------
    let holdStart = 0;
    let holdTime = 0;
    if (scope._isMobile) {
      button.addEventListener('touchstart', evt => {
        holdStart = Date.now();
      }, false);
      button.addEventListener('touchend', evt => {
        holdTime = Date.now() - holdStart;
        scope._longPress = holdTime >= scope._touchHoldDuration;
      }, false);
    } else {
      button.addEventListener('mousedown', evt => {
        holdStart = Date.now();
      }, false);
      window.addEventListener('mouseup', evt => {
        holdTime = Date.now() - holdStart;
        scope._longPress = holdTime >= scope._touchHoldDuration;
      }, false);
    }

    // --------------------------MOUSE CLICK EVENT-------------------------
    button.onclick = () => {
      if (scope._liveTrackingActivated) {
        scope._liveTrackingActivated = false;
        scope.stopTracking();
      }

      if (!scope._longPress) {
        const object = document.getElementById('gpsButton');
        if (object == null) {
          return;
        }
        // distinguish between double-click and single-click
        // https://stackoverflow.com/questions/5497073/how-to-differentiate-single-click-event-and-double-click-event#answer-16033129
        if (object.getAttribute('data-double-click') == null) {
          object.setAttribute('data-double-click', '1');
          setTimeout(() => {
            if (object.getAttribute('data-double-click') === '1') {
              scope.handleClick();
            }
            object.removeAttribute('data-double-click');
          }, 500);
        } else if (object.getAttribute('data-triple-click') == null) {
          object.setAttribute('data-triple-click', '1');
          setTimeout(() => {
            if (object.getAttribute('data-triple-click') === '1') {
              scope.handleDClick();
            }
            object.removeAttribute('data-double-click');
            object.removeAttribute('data-triple-click');
          }, 500);
        } else {
          object.removeAttribute('data-double-click');
          object.removeAttribute('data-triple-click');
          scope.handleTClick();
        }
      } else {
        const restartView = (_callback: () => void): void => {
          scope._firstActivated = false;
          this.GLOBALS!.CESIUM_CAMERA.cancelFlight();
          _callback();
        };

        restartView((): void => {
          this.GLOBALS!.CESIUM_CAMERA.flyTo({
            destination: Cesium.Cartesian3.fromRadians(
              this.GLOBALS!.CESIUM_CAMERA.positionCartographic.longitude,
              this.GLOBALS!.CESIUM_CAMERA.positionCartographic.latitude,
              250),
            orientation: {
              heading: this.GLOBALS!.CESIUM_CAMERA.heading,
              pitch: Cesium.Math.toRadians(-75),
              roll: 0
            }
          });
        });
      }
    };
  }

  /**
   * Handle single-click.
   */
  private handleClick(): void {
    const scope = this;

    if (scope._liveTrackingActivated) {
      scope._liveTrackingActivated = false;
      scope.stopTracking();
    } else {
      const button = document.getElementById('gpsButton');
      if (button == null) {
        return;
      }
      button.classList.remove('tracking-ori-activated');
      button.classList.remove('tracking-pos-ori-activated');
      button.classList.add('tracking-deactivated');

      // one time tracking
      scope.startTracking();
    }
  }

  /**
   * Handle double-click.
   */
  private handleDClick(): void {
    const scope = this;

    if (scope._liveTrackingActivated) {
      scope._liveTrackingActivated = false;
      scope.stopTracking();
    } else {
      scope._liveTrackingActivated = true;
      scope._watchPos = false;

      const button = document.getElementById('gpsButton');
      if (button == null) {
        return;
      }
      button.classList.remove('tracking-deactivated');
      button.classList.remove('tracking-ori-deactivated');
      button.classList.add('tracking-ori-activated');

      // tracking in intervals of miliseconds
      scope.startTracking();
    }
  }

  /**
   * Handle triple-click.
   */
  private handleTClick(): void {
    const scope = this;

    if (scope._liveTrackingActivated) {
      scope._liveTrackingActivated = false;
      scope.stopTracking();
    } else {
      scope._liveTrackingActivated = true;
      scope._watchPos = true;

      const button = document.getElementById('gpsButton');
      if (button == null) {
        return;
      }
      button.classList.remove('tracking-deactivated');
      button.classList.remove('tracking-pos-ori-deactivated');
      button.classList.add('tracking-pos-ori-activated');

      // tracking in intervals of miliseconds
      scope.startTracking();
    }
  }

  private startTracking(): void {
    const scope = this;

    const showPosition = (position: any): void => {
      const getLocation = (): void => {
        if (window.DeviceOrientationEvent) {
          const auxOrientation = (event: DeviceOrientationEvent) => {
            flyToLocationWithOrientation(position, event);
            setTimeout(() => {
              // one-time event
              window.removeEventListener('deviceorientation', auxOrientation, false);
            }, scope._timerMilliseconds);
          };
          window.addEventListener('deviceorientation', auxOrientation, false);
        } else {
          this.UTILS!.dialog.error('Exact geolocation is not supported by this device.');
          flyToLocationWithOrientation(position, event);
        }
      };

      getLocation();

      const flyToLocationWithOrientation = (toPosition: any, ori: any): void => {
        let oriAlpha = 0;
        let oriBeta = 0;
        let oriGamma = 0;
        let oriHeight = 2;

        let angle = 0;
        if (ori.webkitCompassHeading) {
          angle = ori.webkitCompassHeading;
        } else {
          angle = 360 - ori.alpha;
        }

        if (typeof scope._savedAlpha !== 'undefined') {
          const diffAngle = angle - scope._savedAlpha;
          if (diffAngle > 180) {
            angle -= 360;
          } else if (diffAngle < -180) {
            angle += 360;
          }
        }

        oriAlpha = Cesium.Math.toRadians(angle);
        scope._savedAlpha = oriAlpha;

        const setFirstPersonView = () => {
          if (!scope._firstActivated) {
            oriBeta = 0;
          } else {
            oriBeta = this.GLOBALS!.CESIUM_CAMERA.pitch;
          }
          oriGamma = 0;
          oriHeight = 2;
        };

        const setDebugView = () => {
          oriBeta = Cesium.Math.toRadians(-90);
          oriGamma = 0;
          oriHeight = 150;
        };

        // change view if specified in URL
        const URL = require('url-parse');
        const paraUrl = (new URL(window.location.href, true)).query.viewMode;
        if (paraUrl) {
          switch (paraUrl.toLowerCase()) {
            case 'fpv':
              // first person view
              setFirstPersonView();
              break;
            case 'debug':
              // debug view
              setDebugView();
              break;
            default:
              // default view = first person view
              setFirstPersonView();
          }
        } else {
          // default view = first person view
          setFirstPersonView();
        }

        this.GLOBALS!.CESIUM_CAMERA.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(toPosition.coords.longitude, toPosition.coords.latitude, oriHeight),
          orientation: {
            heading: oriAlpha,
            pitch: oriBeta,
            roll: oriGamma
          },
          complete: () => {
            scope._firstActivated = true;
            if (scope._liveTrackingActivated) {
              if (!scope._longPress) {
                // real-time tracking
                scope._timer = setTimeout(() => {
                  if (scope._watchPos) {
                    // also check position in real-time
                    scope.startTracking();
                  } else {
                    // only check orientation in real-time
                    showPosition(toPosition);
                  }
                }, scope._timerMilliseconds);
              }
            }
          }
        });
      };
    };

    const showError = (error: any) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.UTILS!.dialog.error('Geolocation denied by user.');
          break;
        case error.POSITION_UNAVAILABLE:
          this.UTILS!.dialog.error('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          this.UTILS!.dialog.error('Location request has timed out.');
          break;
        case error.UNKNOWN_ERROR:
          this.UTILS!.dialog.error('An unknown error has occurred while requesting location information.');
          break;
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      this.UTILS!.dialog.error('Geolocation is not supported by this browser.');
    }
  }

  private stopTracking(): void {
    const scope = this;

    scope._watchPos = false;

    const button = document.getElementById('gpsButton');
    if (button == null) {
      return;
    }
    button.classList.remove('tracking-activated');
    button.classList.add('tracking-deactivated');

    clearTimeout(scope._timer);
  }

  get liveTrackingActivated(): boolean {
    return this._liveTrackingActivated;
  }

  set liveTrackingActivated(value: boolean) {
    this._liveTrackingActivated = value;
  }

  get timer(): number {
    return this._timer;
  }

  set timer(value: number) {
    this._timer = value;
  }

  get timerMilliseconds(): number {
    return this._timerMilliseconds;
  }

  set timerMilliseconds(value: number) {
    this._timerMilliseconds = value;
  }

  get savedAlpha(): number {
    return this._savedAlpha;
  }

  set savedAlpha(value: number) {
    this._savedAlpha = value;
  }

  get firstActivated(): boolean {
    return this._firstActivated;
  }

  set firstActivated(value: boolean) {
    this._firstActivated = value;
  }

  get watchPos(): boolean {
    return this._watchPos;
  }

  set watchPos(value: boolean) {
    this._watchPos = value;
  }

  get touchHoldDuration(): number {
    return this._touchHoldDuration;
  }

  set touchHoldDuration(value: number) {
    this._touchHoldDuration = value;
  }

  get longPress(): boolean {
    return this._longPress;
  }

  set longPress(value: boolean) {
    this._longPress = value;
  }

  get isMobile(): boolean {
    return this._isMobile;
  }

  set isMobile(value: boolean) {
    this._isMobile = value;
  }
}
