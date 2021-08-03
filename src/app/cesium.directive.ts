import {Directive, ElementRef, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {environment as ENV} from '../environments/environment';
import {ExtensionDesktop} from '../extensions/extension.desktop';
import {ExtensionMobile} from '../extensions/extension.mobile';
import {UtilityCamera} from '../utilities/utility.camera';
import {UtilityOS} from '../utilities/utility.os';
import {LogService} from './log/log.service';

@Directive({
  selector: '[appCesium]'
})
export class CesiumDirective implements OnInit {

  constructor(private cookieService?: CookieService, private logService?: LogService, private el?: ElementRef) {
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
      ENV.cesiumViewer = new ENV.cesium.Viewer('cesiumContainer', {
        // TODO Hardcoded imagery provider?
        //selectedImageryProviderViewModel: ENV.cesium.createDefaultImageryProviderViewModels()[1],
        shadows: (shadows === 'true'),
        terrainShadows: parseInt(terrainShadows, 10),
        timeline: false,
        animation: false,
        fullscreenButton: false
      });

      ENV.cesiumCamera = ENV.cesiumViewer.scene.camera;

      // Init ion access token
      // TODO Get token from URL parameter OR session/cookie?
      //ENV.cesium.Ion.defaultAccessToken = '';

      resolve(true);
    });
  }

  private initGUISpecific(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // Adjust GUI and program behaviours towards current operating systems
      if (UtilityOS.isMobile()) {
        new ExtensionMobile();
      } else {
        new ExtensionDesktop();
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
          UtilityCamera.flyToPosition(JSON.parse(this.cookieService.get(ENV.cookieNames.cameraPosition)));
          resolve(true);
        }
      }
    });
  }
}
