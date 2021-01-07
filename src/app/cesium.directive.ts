import {Directive, ElementRef, OnInit} from "@angular/core";
import {environment as ENV} from "../environments/environment";
import {ExtensionDesktop} from "../extensions/extension.desktop";
import {ExtensionMobile} from "../extensions/extension.mobile";
import {UtilityOS} from "../utilities/utility.os";

@Directive({
  selector: "[appCesium]"
})
export class CesiumDirective implements OnInit {

  constructor(private el?: ElementRef) {
  }

  ngOnInit() {
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

    // Adjust GUI and program behaviours towards current operating systems
    if (UtilityOS.isMobile()) {
      new ExtensionMobile();
    } else {
      new ExtensionDesktop();
    }
  }
}
