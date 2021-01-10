import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {_MatMenuDirectivesModule, MatMenuModule} from "@angular/material/menu";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {CookieService} from "ngx-cookie-service";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {CesiumDirective} from "./cesium.directive";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DialogConfirmContent, DialogConfirmFunction, DialogErrorContent, DialogErrorFunction, DialogInfoContent, DialogInfoFunction, DialogWarningContent, DialogWarningFunction} from "./dialog/dialog.function";
import {LogPublishersService} from "./log/log-publishers.service";
import {LogService} from "./log/log.service";
import { ToolboxFunction } from './toolbox/toolbox.function';
import {WidgetsFunction} from "./widgets/widgets.function";

@NgModule({
  declarations: [
    AppComponent,
    CesiumDirective,
    DialogInfoContent,
    DialogInfoFunction,
    DialogConfirmContent,
    DialogConfirmFunction,
    DialogWarningContent,
    DialogWarningFunction,
    DialogErrorContent,
    DialogErrorFunction,
    ToolboxFunction,
    WidgetsFunction
  ],
  entryComponents: [
    DialogInfoContent,
    DialogInfoFunction,
    DialogConfirmContent,
    DialogConfirmFunction,
    DialogWarningContent,
    DialogWarningFunction,
    DialogErrorContent,
    DialogErrorFunction,
    ToolboxFunction,
    WidgetsFunction
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
    MatMenuModule
  ],
  bootstrap: [
    AppComponent,
    DialogInfoFunction,
    DialogConfirmFunction,
    DialogWarningFunction,
    DialogErrorFunction,
    ToolboxFunction,
    WidgetsFunction
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: "fill"}},
    CookieService,
    LogService,
    LogPublishersService
  ]
})
export class AppModule {
}
