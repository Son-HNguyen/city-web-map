import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {_MatMenuDirectivesModule, MatMenuModule} from '@angular/material/menu';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
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
} from './dialog/dialog.function';
import {LogPublishersService} from './log/log-publishers.service';
import {LogService} from './log/log.service';
import {GridsterModule} from "angular-gridster2";
import {MatSelectModule} from "@angular/material/select";
import { MenuComponent } from './menu/menu.component';
import { NavComponent } from './nav/nav.component';
import { InfoComponent } from './info/info.component';
import { StatusComponent } from './status/status.component';
import { ListComponent } from './list/list.component';

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
    ListComponent
  ],
  entryComponents: [
    DialogInfoContentComponent,
    DialogInfoComponent,
    DialogConfirmContentComponent,
    DialogConfirmComponent,
    DialogWarningContentComponent,
    DialogWarningComponent,
    DialogErrorContentComponent,
    DialogErrorComponent
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
    MatOptionModule
  ],
  bootstrap: [
    AppComponent,
    DialogInfoComponent,
    DialogConfirmComponent,
    DialogWarningComponent,
    DialogErrorComponent
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    CookieService,
    LogService,
    LogPublishersService
  ]
})
export class AppModule {
}
