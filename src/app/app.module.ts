import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
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
import { ToolboxComponent } from './toolbox/toolbox.component';
import {WidgetsComponent} from './widgets/widgets.component';

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
    ToolboxComponent,
    WidgetsComponent
  ],
  entryComponents: [
    DialogInfoContentComponent,
    DialogInfoComponent,
    DialogConfirmContentComponent,
    DialogConfirmComponent,
    DialogWarningContentComponent,
    DialogWarningComponent,
    DialogErrorContentComponent,
    DialogErrorComponent,
    ToolboxComponent,
    WidgetsComponent
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
    DialogInfoComponent,
    DialogConfirmComponent,
    DialogWarningComponent,
    DialogErrorComponent,
    ToolboxComponent,
    WidgetsComponent
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
