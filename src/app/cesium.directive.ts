import {Directive, ElementRef, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {DesktopExtension} from '../extensions/desktop.extension';
import {MobileExtension} from '../extensions/mobile.extension';
import {LogService} from './log/log.service';
import * as cesium from "cesium";
import {UtilityService} from "../utils.service";
import {GlobalService} from "../global.service";

@Directive({
  selector: '[appCesium]'
})
export class CesiumDirective implements OnInit {

  constructor(
    private cookieService?: CookieService,
    private logService?: LogService,
    private el?: ElementRef,
    private GLOBALS?: GlobalService,
    private UTILS?: UtilityService) {
  }

  async ngOnInit() {
    // Initialize clock, Cesium viewer, camera, etc.
    await this.initBasicCesiumComponents();
    // Tailor GUI components depending on the OS
    await this.initGUISpecific();
    // Resume last camera location
    await this.resumeCamera();
  }

  private initBasicCesiumComponents(): Promise<void> {
    const scope = this;
    return new Promise<void>((resolve, reject) => {
      if (scope.el == null) {
        return;
      }

      scope.el.nativeElement.id = 'cesiumContainer';

      // Init Cesium camera
      // TODO Central manager for URL parameters
      const URL = require('url-parse');
      const shadows = (new URL(window.location.href, true)).query.shadows;
      const terrainShadows = (new URL(window.location.href, true)).query.terrainShadows;
      this.GLOBALS!.CESIUM_VIEWER = new cesium.Viewer('cesiumContainer', {
        // TODO Hardcoded imagery provider?
        //selectedImageryProviderViewModel: ENV.cesium.createDefaultImageryProviderViewModels()[1],
        shadows: (shadows === 'true'), // TODO Toggle shadow using an app
        terrainShadows: parseInt(terrainShadows, 10),
        timeline: false,
        animation: false,
        fullscreenButton: false
      });

      this.GLOBALS!.CESIUM_CAMERA = this.GLOBALS!.CESIUM_VIEWER.scene.camera;

      // Init ion access token
      // TODO Get token from URL parameter OR session/cookie?
      //cesium.Ion.defaultAccessToken = '';

      resolve();
    });
  }

  private initGUISpecific(): Promise<void> {
    const scope = this;
    return new Promise<void>((resolve, reject) => {
      // Adjust GUI and program behaviours towards current operating systems
      if (scope.UTILS!.os.isMobile()) {
        new MobileExtension();
      } else {
        new DesktopExtension();
      }
      resolve();
    });
  }

  private resumeCamera(): Promise<void> {
    const scope = this;
    return new Promise<void>((resolve, reject) => {
      if (this.GLOBALS!.WORKSPACE.cameraLocation != null) {
        if (scope.logService != null) {
          scope.logService!.info('Resume camera location from the last session');
        }
        scope.UTILS!.camera.flyToPosition(this.GLOBALS!.WORKSPACE.cameraLocation).then(() => resolve());
      }
    });
  }
}
