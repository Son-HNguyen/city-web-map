import {Directive, ElementRef, OnInit} from '@angular/core';
import {DesktopExtension} from '../extensions/desktop.extension';
import {MobileExtension} from '../extensions/mobile.extension';
import {LogService} from './log/log.service';
import * as cesium from "cesium";
import * as Cesium from "cesium";
import {UtilityService} from "../utils.service";
import {GlobalService} from "../global.service";
import {GeocoderService} from "../core/Workspace";
import {NominatimExtension} from "../extensions/nominatim.extension";

@Directive({
  selector: '[appCesium]'
})
export class CesiumDirective implements OnInit {

  constructor(private logService?: LogService,
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
      const shadows = (new URL(window.location.href, true)).query.shadows; // TODO Read from cookie/settings? Add toggle?
      const terrainShadows = (new URL(window.location.href, true)).query.terrainShadows; // TODO Read from cookie/settings? Add toggle?

      this.GLOBALS!.CESIUM_VIEWER = new cesium.Viewer('cesiumContainer', {
        // TODO Hardcoded imagery provider?
        //selectedImageryProviderViewModel: ENV.cesium.createDefaultImageryProviderViewModels()[1],
        shadows: (shadows === 'true'), // TODO Toggle shadow using an app
        terrainShadows: parseInt(terrainShadows, 10),
        timeline: false,
        animation: false,
        fullscreenButton: false,
      });

      this.GLOBALS!.CESIUM_CAMERA = this.GLOBALS!.CESIUM_VIEWER.scene.camera;

      // Init ion access token
      // TODO Get token from URL parameter OR session/cookie?
      //cesium.Ion.defaultAccessToken = '';

      // Geocoder
      // TODO Check whether a non-default ion access token is available, if not then use Nominatim
      let savedGeocoder = this.GLOBALS!.WORKSPACE.geocoder;
      this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel.autoComplete = savedGeocoder.autocomplete; // TODO On/Off for ion/Nominatim?
      let geocoderServices = [];
      for (let s of savedGeocoder.geocoderServices) {
        switch (s) {
          case GeocoderService.CARTOGRAPHIC:
            geocoderServices.push(new Cesium.CartographicGeocoderService());
            break;
          case GeocoderService.CESIUM_ION:
            geocoderServices.push(new Cesium.IonGeocoderService({
              scene: this.GLOBALS!.CESIUM_VIEWER.scene
            }));
            break;
          case GeocoderService.NOMINATIM:
            geocoderServices.push(new NominatimExtension());
            break;
        }
      }
      this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel._geocoderServices = geocoderServices;

      // TODO Set default imagery (base) layer
      // Imagery layer
      const imageryProviders = this.GLOBALS!.CESIUM_VIEWER.baseLayerPicker.viewModel.imageryProviderViewModels;
      this.GLOBALS!.CESIUM_VIEWER.baseLayerPicker.viewModel.selectedImagery =
        imageryProviders[this.GLOBALS!.WORKSPACE.imageryLayerIndex];

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
