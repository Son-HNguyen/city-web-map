import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GlobeDirective} from './globe.directive';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DialogConfirmComponent,
  DialogConfirmContentComponent,
  DialogErrorComponent,
  DialogErrorContentComponent,
  DialogImageryLayerPickerComponent,
  DialogImageryLayerPickerContentComponent,
  DialogInfoComponent,
  DialogInfoContentComponent,
  DialogLoadComponent,
  DialogLoadContentComponent,
  DialogReloadComponent,
  DialogReloadContentComponent,
  DialogSearchComponent,
  DialogSearchContentComponent,
  DialogWarningComponent,
  DialogWarningContentComponent
} from './dialog/dialog.component';
import {LogPublishersService} from './log/log-publishers.service';
import {LogService} from './log/log.service';
import {GridsterModule} from "angular-gridster2";
import {MatSelectModule} from "@angular/material/select";
import {UtilityService} from "../services/utils.service";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {CheatSheetComponent, CheatSheetContentComponent} from './cheat-sheet/cheat-sheet.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SnackBarComponent, SnackBarContentComponent} from './snack-bar/snack-bar.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {GlobalService} from "../services/global.service";
import {FullscreenComponent} from './fullscreen/fullscreen.component';
import {FlyHomeComponent} from './fly-home/fly-home.component';
import {SearchLocationComponent} from './search-location/search-location.component';
import {TimelineComponent} from './timeline/timeline.component';
import {MatCardModule} from "@angular/material/card";
import {MatSliderModule} from "@angular/material/slider";
import {MatBadgeModule} from "@angular/material/badge";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {SettingsComponent} from './settings/settings.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgxDropzoneModule} from "ngx-dropzone";
import {ImageryLayerPickerComponent} from './imagery-layer-picker/imagery-layer-picker.component';
import {WorkspaceViewComponent} from './workspace-view/workspace-view.component';
import {DetailViewComponent} from './detail-view/detail-view.component';
import {StatusViewComponent} from './status-view/status-view.component';
import {InfoViewComponent} from './info-view/info-view.component';
import {SwitchThemeComponent} from './switch-theme/switch-theme.component';
import {NgxResizableModule} from "@3dgenomes/ngx-resizable";

@NgModule({
  declarations: [
    AppComponent,
    GlobeDirective,
    DialogInfoContentComponent,
    DialogInfoComponent,
    DialogConfirmContentComponent,
    DialogConfirmComponent,
    DialogWarningContentComponent,
    DialogWarningComponent,
    DialogErrorContentComponent,
    DialogErrorComponent,
    DialogSearchComponent,
    DialogSearchContentComponent,
    DialogReloadComponent,
    DialogReloadContentComponent,
    DialogLoadComponent,
    DialogLoadContentComponent,
    DialogImageryLayerPickerComponent,
    DialogImageryLayerPickerContentComponent,
    CheatSheetComponent,
    CheatSheetContentComponent,
    SnackBarComponent,
    SnackBarContentComponent,
    FullscreenComponent,
    FlyHomeComponent,
    SearchLocationComponent,
    TimelineComponent,
    SettingsComponent,
    ImageryLayerPickerComponent,
    WorkspaceViewComponent,
    DetailViewComponent,
    StatusViewComponent,
    InfoViewComponent,
    SwitchThemeComponent
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
    DialogSearchComponent,
    DialogSearchContentComponent,
    DialogReloadComponent,
    DialogReloadContentComponent,
    DialogLoadComponent,
    DialogLoadContentComponent,
    DialogImageryLayerPickerComponent,
    DialogImageryLayerPickerContentComponent,
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
    MatIconModule,
    MatMenuModule,
    GridsterModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    MatSliderModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    NgxDropzoneModule,
    NgxResizableModule
  ],
  bootstrap: [
    AppComponent,
    DialogInfoComponent,
    DialogConfirmComponent,
    DialogWarningComponent,
    DialogErrorComponent,
    DialogSearchComponent,
    DialogReloadComponent,
    DialogLoadComponent,
    DialogImageryLayerPickerComponent,
    CheatSheetComponent,
    SnackBarComponent
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    LogService,
    LogPublishersService,
    GlobalService,
    UtilityService,
    {provide: APP_INITIALIZER, useFactory: appInitCookie, deps: [UtilityService], multi: true}
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

export function appInitCookie(provider: UtilityService) {
  return () => provider.appInitStorage();
}
