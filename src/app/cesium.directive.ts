import {Directive, ElementRef, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {DesktopExtension} from '../extensions/desktop.extension';
import {MobileExtension} from '../extensions/mobile.extension';
import {LogService} from './log/log.service';
import * as cesium from "cesium";
import {GlobalService} from "../global.service";
import {UtilityService} from "../utils.service";

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
    // Process cookies saved from the last session
    await this.readCookies();
  }

  private initBasicCesiumComponents(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.el == null) {
        return;
      }

      this.el.nativeElement.id = 'cesiumContainer';

      // Init Cesium camera
      // TODO Central manager for URL parameters
      const URL = require('url-parse');
      const shadows = (new URL(window.location.href, true)).query.shadows;
      const terrainShadows = (new URL(window.location.href, true)).query.terrainShadows;
      this.GLOBALS!.cesiumViewer = new cesium.Viewer('cesiumContainer', {
        // TODO Hardcoded imagery provider?
        //selectedImageryProviderViewModel: ENV.cesium.createDefaultImageryProviderViewModels()[1],
        shadows: (shadows === 'true'),
        terrainShadows: parseInt(terrainShadows, 10),
        timeline: false,
        animation: false,
        fullscreenButton: false
      });

      this.GLOBALS!.cesiumCamera = this.GLOBALS!.cesiumViewer.scene.camera;

      // Init ion access token
      // TODO Get token from URL parameter OR session/cookie?
      //cesium.Ion.defaultAccessToken = '';

      resolve(true);
    });
  }

  private initGUISpecific(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // Adjust GUI and program behaviours towards current operating systems
      if (this.UTILS!.os.isMobile()) {
        new MobileExtension();
      } else {
        new DesktopExtension();
      }
      resolve(true);
    });
  }

  private readCookies(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.logService != null) {
        this.logService.info('Resume camera location from the last session. ' +
          'You can change this behaviour in the settings.');
        if (this.cookieService != null) {
          //this.UTILS!.camera.flyToPosition(JSON.parse(this.cookieService.get(this.GLOBALS!.cookieNames.cameraPosition)));
          const cookie = this.cookieService.get(this.GLOBALS!.cookieNames.workspace);
          const savedWorkspace = JSON.parse(cookie);
          this.UTILS!.camera.flyToPosition(savedWorkspace._lastLocation);
          resolve(true);
        }
      }
    });
  }
}
