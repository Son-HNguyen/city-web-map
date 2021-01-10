import {Directive, ElementRef, OnInit} from "@angular/core";
import {CookieService} from "ngx-cookie-service";
import {environment, environment as ENV} from "../environments/environment";
import {ExtensionDesktop} from "../extensions/extension.desktop";
import {ExtensionMobile} from "../extensions/extension.mobile";
import {UtilityCamera} from "../utilities/utility.camera";
import {UtilityOS} from "../utilities/utility.os";
import {LogService} from "./log/log.service";

@Directive({
  selector: "[appCesium]"
})
export class CesiumDirective implements OnInit {

  constructor(private cookieService?: CookieService, private logService?: LogService, private el?: ElementRef) {
  }

  async ngOnInit() {
    // Initialize clock, Cesium viewer, camera, etc.
    await this.initBasicCesiumComponents();
    // Initialize GUI components used for both desktop and mobile
    await this.initGUICommon();
    // Tailor GUI components depending on the OS
    await this.initGUISpecific();
    // Process cookies saved from the last session
    await this.readCookies();
  }

  private initBasicCesiumComponents(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.el == null) return;
      this.el.nativeElement.id = "cesiumContainer";
      const Url = require("url-parse");
      const shadows = (new Url(window.location.href, true)).query["shadows"];
      const terrainShadows = (new Url(window.location.href, true)).query["terrainShadows"];
      const clock = new ENV.Cesium.Clock({
        shouldAnimate: true
      });

      ENV.cesiumViewer = new ENV.Cesium.Viewer("cesiumContainer", {
        selectedImageryProviderViewModel: ENV.Cesium.createDefaultImageryProviderViewModels()[1],
        timeline: true,
        animation: true,
        fullscreenButton: false,
        shadows: (shadows == "true"),
        terrainShadows: parseInt(terrainShadows),
        clockViewModel: new ENV.Cesium.ClockViewModel(clock)
      });

      ENV.cesiumCamera = ENV.cesiumViewer.scene.camera;
      resolve(true);
    });
  }

  private initGUICommon(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {

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
      this.logService!.info("Resume camera location from the last session. " +
        "You can change this behaviour in the settings.");
      UtilityCamera.flyToPosition(JSON.parse(this.cookieService!.get(ENV.cookieNames.cameraPosition)));
      resolve(true);
    });
  }
}
