import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {_MatMenuDirectivesModule, MatMenuModule} from '@angular/material/menu';
import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CesiumDirective} from './cesium.directive';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DialogConfirmContentComponent,
  DialogConfirmComponent,
  DialogErrorContentComponent,
  DialogErrorComponent,
  DialogInfoContentComponent,
  DialogInfoComponent,
  DialogWarningContentComponent,
  DialogWarningComponent
} from './dialog/dialog.component';
import {LogPublishersService} from './log/log-publishers.service';
import {LogService} from './log/log.service';
import {GridsterModule} from "angular-gridster2";
import {MatSelectModule} from "@angular/material/select";
import {MenuComponent} from './menu/menu.component';
import {NavComponent} from './nav/nav.component';
import {InfoComponent} from './info/info.component';
import {StatusComponent} from './status/status.component';
import {MenuContextComponent} from './menu-context/menu-context.component';
import {ViewListComponent} from './view-list/view-list.component';
import {LayerListComponent} from './layer-list/layer-list.component';
import {UtilityService} from "../utils.service";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {CheatSheetComponent, CheatSheetContentComponent} from './cheat-sheet/cheat-sheet.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SnackBarComponent, SnackBarContentComponent} from './snack-bar/snack-bar.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {GlobalService} from "../global.service";
import { ButtonToggleLayoutComponent } from './button-toggle-layout/button-toggle-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    CesiumDirective,
    DialogInfoContentComponent,
    DialogInfoComponent,
    DialogConfirmContentComponent,
    DialogConfirmComponent,
    DialogWarningContentComponent,
    DialogWarningComponent,
    DialogErrorContentComponent,
    DialogErrorComponent,
    MenuComponent,
    NavComponent,
    InfoComponent,
    StatusComponent,
    MenuContextComponent,
    ViewListComponent,
    LayerListComponent,
    CheatSheetComponent,
    CheatSheetContentComponent,
    SnackBarComponent,
    SnackBarContentComponent,
    ButtonToggleLayoutComponent
  ],
  entryComponents: [
    DialogInfoComponent,
    DialogInfoContentComponent,
    DialogConfirmComponent,
    DialogConfirmContentComponent,
    DialogWarningComponent,
    DialogWarningContentComponent,
    DialogErrorComponent,
    DialogErrorContentComponent,
    CheatSheetComponent,
    CheatSheetContentComponent,
    SnackBarComponent,
    SnackBarContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatButtonModule,
    _MatMenuDirectivesModule,
    MatIconModule,
    MatMenuModule,
    GridsterModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  bootstrap: [
    AppComponent,
    DialogInfoComponent,
    DialogConfirmComponent,
    DialogWarningComponent,
    DialogErrorComponent,
    CheatSheetComponent,
    SnackBarComponent
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    CookieService,
    LogService,
    LogPublishersService,
    GlobalService,
    UtilityService
  ]
})
export class AppModule {
  /**
   * Allows for retrieving singletons using `AppModule.injector.get(MyService)`
   * This is good to prevent injecting the service as constructor parameter.
   * https://stackoverflow.com/questions/39101865/angular-2-inject-dependency-outside-constructor
   */
  static injector: Injector;

  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
