import {Directive, ElementRef, OnInit} from '@angular/core';
import {DesktopExtension} from '../extensions/desktop.extension';
import {MobileExtension} from '../extensions/mobile.extension';
import {LogService} from '../services/log.service';
import {UtilityService} from "../services/utils.service";
import {GlobalService} from "../services/global.service";

@Directive({
  selector: '[appGlobe]'
})
export class GlobeDirective implements OnInit {
  constructor(private logService?: LogService,
              private el?: ElementRef,
              private GLOBALS?: GlobalService,
              private UTILS?: UtilityService) {
  }

  async ngOnInit() {
    // Initialize clock, globe, etc.
    await this.initBasicGlobeComponents();
    // Tailor GUI components depending on the OS
    await this.initGUISpecific();
    // Resume last camera location
    await this.resumeCamera();
  }

  private initBasicGlobeComponents(): Promise<void> {
    const scope = this;
    return new Promise<void>((resolve, reject) => {
      if (scope.el == null) {
        return;
      }

      // This must be executed BEFORE the viewer and camera can be set
      scope.el.nativeElement.id = 'cesiumContainer';
      // Initialize the globe depending on the engine type given in the workspace
      this.GLOBALS!.GLOBE.initCameraAndViewer();
      // And set the default imagery layer index correspondingly
      this.GLOBALS!.WORKSPACE.updateImageryLayerIndex(this.GLOBALS!.GLOBE.DEFAULT_IMAGERY_LAYER_INDEX);

      // Init ion access token
      // TODO Get token from URL parameter OR session/cookie?
      //cesium.Ion.defaultAccessToken = '';

      // Geocoder
      this.GLOBALS!.GLOBE.setGeocoder(this.GLOBALS!.WORKSPACE.geocoder);

      // Imagery layer
      this.GLOBALS!.GLOBE.setImageryLayer(this.GLOBALS!.WORKSPACE.imageryLayerIndex);

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
    return new Promise<void>((resolve, reject) => {
      if (this.GLOBALS!.WORKSPACE.cameraLocation != null) {
        if (this.logService != null) {
          this.logService!.info('Resume camera location from the last session');
        }
        this.GLOBALS!.GLOBE.flyToCameraLocation(this.GLOBALS!.WORKSPACE.cameraLocation).then(() => resolve());
      }
    });
  }
}
