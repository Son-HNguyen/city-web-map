/*
 * City Web Map
 * http://www.3dcitydb.org/
 *
 * Copyright 2015 - 2021
 * Chair of Geoinformatics
 * Department of Aerospace and Geodesy
 * Technical University of Munich, Germany
 * https://www.gis.lrg.tum.de/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LogService} from '../log/log.service';
import {FormControl} from "@angular/forms";
import {Observable, of} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {GlobalService} from "../../global.service";
import {NominatimExtension} from "../../extensions/nominatim.extension";
import * as Cesium from "cesium";
import {GeocoderService, Workspace} from "../../core/Workspace";
import {NgxDropzoneChangeEvent} from "ngx-dropzone";

/**
 * Information dialog
 */

export interface DialogInfoData {
  message: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogInfoComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogInfoComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.info.content.component.html'
})
export class DialogInfoContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogInfoContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogInfoData,
    public LOGGER: LogService) {
    this.LOGGER.info(this.data.message);
  }

  onClick(): void {
    this.dialogRef.close();
  }
}

/**
 * Confirmation dialog
 */

export interface DialogConfirmData extends DialogInfoData {
  confirmed: boolean;
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogConfirmComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogConfirmComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.confirm.content.component.html'
})
export class DialogConfirmContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,
    public LOGGER: LogService) {
    this.LOGGER.info(this.data.message);
  }

  onNoClick(): void {
    this.data.confirmed = false;
    this.onClick();
  }

  onYesClick(): void {
    this.data.confirmed = true;
    this.onClick();
  }

  private onClick(): void {
    this.LOGGER.debug('User\'s confirmation: ' + this.data.confirmed);
    this.dialogRef.close();
  }
}

/**
 * Warning dialog
 */

export type DialogWarningData = DialogInfoData;

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogWarningComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogWarningComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.warning.content.component.html'
})
export class DialogWarningContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogWarningContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogWarningData,
    public LOGGER: LogService) {
    this.LOGGER.warn(this.data.message);
  }

  onClick(): void {
    this.dialogRef.close();
  }
}

/**
 * Error dialog
 */

export type DialogErrorData = DialogInfoData;

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogErrorComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogErrorComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.error.content.component.html'
})
export class DialogErrorContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogErrorContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogErrorData,
    public LOGGER: LogService) {
    this.LOGGER.error(this.data.message);
  }

  onClick(): void {
    this.dialogRef.close();
  }
}

/**
 * Search dialog
 */
export interface DialogSearchData {
  search: string;
  confirmed: boolean;
}

interface GeocoderSuggestion {
  displayName: string,
  destination: any
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogSearchComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogSearchComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.search.content.component.html',
  styleUrls: ['dialog.search.content.component.css']
})
export class DialogSearchContentComponent implements OnInit {
  inputControl = new FormControl();
  suggestionNames: Array<GeocoderSuggestion>;
  filteredSuggestionNames!: Observable<Array<GeocoderSuggestion>>;

  checkedColor = 'primary';
  checkedAutocomplete: boolean;
  selectedGeocoderService: GeocoderService;
  geocoderServices: Array<GeocoderService> = [GeocoderService.NOMINATIM, GeocoderService.CESIUM_ION];

  // TODO Save looked up geocodes in a list in the GUI -> Viewpoints?

  constructor(
    public dialogRef: MatDialogRef<DialogSearchContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogSearchData,
    public LOGGER: LogService,
    private GLOBALS?: GlobalService) {
    this.data.search = '';
    this.data.confirmed = false;

    let geocoderViewModel = this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel;
    this.suggestionNames = geocoderViewModel.suggestions;
    this.filteredSuggestionNames = of(this.suggestionNames);

    this.checkedAutocomplete = this.GLOBALS!.WORKSPACE.geocoder.autocomplete;
    // Index 0 is CartographicGeocoderService, which is always enabled
    this.selectedGeocoderService = this.GLOBALS!.WORKSPACE.geocoder.geocoderServices[1];
  }

  ngOnInit() {
    this.inputControl.valueChanges.pipe(
      startWith(''),
      // debounceTime(100),
      map(value => {
        let geocoderViewModel = this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel;
        geocoderViewModel._searchText = value;
        return;
      })
    ).subscribe();
  }

  onNoClick() {
    this.data.confirmed = false;
    this.onClick();
  }

  onYesClick(destination?: any) {
    this.data.confirmed = true;
    this.onClick(destination);
  }

  onSelectedSuggestion(destination: any) {
    this.data.confirmed = true;
    this.GLOBALS!.CESIUM_CAMERA.flyTo({
      destination: destination
    });
  }

  private onClick(destination?: any) {
    let geocoderViewModel = this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel;
    if (this.checkedAutocomplete) {
      if (this.suggestionNames.length === 0) {
        return;
      }

      let destinationToFly;
      if (destination != null) {
        destinationToFly = destination;
      } else {
        // Get the first option in the autocomplete list by default
        destinationToFly = this.suggestionNames[0].destination;
      }

      geocoderViewModel.destinationFound(geocoderViewModel, destinationToFly);
      this.onDoneSearching();
    } else {
      this.data.search = this.inputControl.value;
      geocoderViewModel._searchText = this.inputControl.value;
      geocoderViewModel.search.afterExecute.addEventListener(() => {
        this.onDoneSearching();
      });
      geocoderViewModel.search();
    }
  }

  private onDoneSearching() {
    this.dialogRef.close();
  }

  switchGeocoder(selectedValue: GeocoderService) {
    // The geocoderServices array has two objects:
    // CartographicGeocoderService (should be always enabled) and a selectable
    let geocoderServices = this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel._geocoderServices;
    geocoderServices.pop(); // remove the last object in the array
    this.GLOBALS!.WORKSPACE.geocoder.geocoderServices.pop();
    this.GLOBALS!.WORKSPACE.geocoder.geocoderServices.push(selectedValue);
    switch (selectedValue) {
      case GeocoderService.NOMINATIM:
        geocoderServices.push(new NominatimExtension());
        return;
      case GeocoderService.CESIUM_ION:
        geocoderServices.push(new Cesium.IonGeocoderService({
          scene: this.GLOBALS!.CESIUM_VIEWER.scene
        }));
        return;
    }
  }

  handleCheckboxAutocomplete(checked: boolean) {
    console.log(this.checkedAutocomplete);
    this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel.autoComplete = checked;
    this.GLOBALS!.WORKSPACE.geocoder.autocomplete = checked;
    this.checkedAutocomplete = checked;
  }
}

/**
 * Reload dialog when importing workspace from external file
 */
export interface DialogReloadData {
  userPrompt: DialogReloadPrompt
}

export enum DialogReloadPrompt {
  SAVE_THEN_RELOAD, // Save the current workspace, then reload the imported workspace
  IGNORE_AND_RELOAD, // Ignore the current workspace and reload the imported workspace
  CANCEL // Do not load the imported workspace
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogReloadComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogReloadComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.reload.content.component.html',
  styleUrls: ['dialog.reload.content.component.css']
})
export class DialogReloadContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogReloadContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogReloadData,
    public LOGGER: LogService,
    private GLOBALS?: GlobalService) {
  }

  onSaveThenReload() {
    this.data.userPrompt = DialogReloadPrompt.SAVE_THEN_RELOAD;
    this.dialogRef.close();
  }

  onIgnoreAndReload() {
    this.data.userPrompt = DialogReloadPrompt.IGNORE_AND_RELOAD;
    this.dialogRef.close();
  }

  onCancel() {
    this.data.userPrompt = DialogReloadPrompt.CANCEL;
    this.dialogRef.close();
  }
}

/**
 * Reload dialog when importing workspace from external file
 */
interface DialogLoadData {
  file: File | undefined
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogLoadComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogLoadComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.load.content.component.html',
  styleUrls: ['dialog.load.content.component.css']
})
export class DialogLoadContentComponent {
  files: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogLoadContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogLoadData,
    public LOGGER: LogService,
    private GLOBALS?: GlobalService) {
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    //this.files.push(...event.addedFiles);
    if (event.addedFiles != null && event.addedFiles.length > 0) {
      this.files = [];
      this.files.push(event.addedFiles[0]);
    }
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onCancel() {
    this.data.file = undefined;
    this.dialogRef.close();
  }

  onLoad() {
    this.data.file = this.files.length === 0 ? undefined : this.files[0];
    this.dialogRef.close();
  }
}

/**
 * Dialog for the imagery (base) layer picker
 */
interface DialogImageryLayerPickerData {
  // TODO Needed? Which attributes?
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogImageryLayerPickerComponent {
  static dialog: MatDialog;

  constructor(dialog: MatDialog) {
    DialogImageryLayerPickerComponent.dialog = dialog;
  }
}

@Component({
  templateUrl: 'dialog.imagery.content.component.html',
  styleUrls: ['dialog.imagery.content.component.css']
})
export class DialogImageryLayerPickerContentComponent {
  imageryLayers = Workspace.DEFAULT_CESIUM_IMAGERY_LAYER_COLLECTION_INFO;

  constructor(
    public dialogRef: MatDialogRef<DialogImageryLayerPickerContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogImageryLayerPickerData,
    public LOGGER: LogService,
    private GLOBALS?: GlobalService) {
  }

  noSort(): number {
    return 0;
  }

  isSelected(index: number) {
    return this.GLOBALS!.WORKSPACE.imageryLayerIndex === index;
  }

  onSelect(index: number) {
    const imageryProviders = this.GLOBALS!.CESIUM_VIEWER.baseLayerPicker.viewModel.imageryProviderViewModels;
    this.GLOBALS!.CESIUM_VIEWER.baseLayerPicker.viewModel.selectedImagery =
      imageryProviders[index];
    this.GLOBALS!.WORKSPACE.imageryLayerIndex = index;
    this.dialogRef.close();
  }

  onAdd(): void {
    // TODO Set data?
    // TODO Implement
    this.dialogRef.close();
  }
}
