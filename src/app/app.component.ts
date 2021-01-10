import {Component, HostListener} from "@angular/core";
import {CookieService} from "ngx-cookie-service";
import {environment as ENV} from "../environments/environment";
import {CesiumCameraPosition, UtilityCamera} from "../utilities/utility.camera";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "city-web-map";

  constructor(private cookieService: CookieService) {
  }

  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHandler(event: any) {
    this.cookieService.set(ENV.cookieNames.cameraPosition, JSON.stringify(UtilityCamera.getPosition()), ENV.cookieExpireDefault);
  }
}
