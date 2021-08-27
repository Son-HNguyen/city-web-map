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

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {LogService} from '../log/log.service';
import {FormControl} from "@angular/forms";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {debounceTime, map, startWith} from "rxjs/operators";
import {GlobalService} from "../../global.service";

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
    public logger: LogService) {
    this.logger.info(this.data.message);
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
    public logger: LogService) {
    this.logger.info(this.data.message);
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
    this.logger.debug('User\'s confirmation: ' + this.data.confirmed);
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
    public logger: LogService) {
    this.logger.warn(this.data.message);
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
    public logger: LogService) {
    this.logger.error(this.data.message);
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
export class DialogSearchContentComponent implements OnInit, OnDestroy {
  inputControl = new FormControl();
  suggestionNames: Array<GeocoderSuggestion>;
  filteredSuggestionNames!: Observable<Array<GeocoderSuggestion>>;

  isSearchingSubject!: BehaviorSubject<boolean>;
  private isSearchingSubscription!: Subscription;

  // TODO Save looked up geocodes in a list in the GUI

  constructor(
    public dialogRef: MatDialogRef<DialogSearchContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogSearchData,
    public logger: LogService,
    private GLOBALS?: GlobalService) {
    this.data.search = '';
    this.data.confirmed = false;
    this.suggestionNames = [];
  }

  ngOnInit() {
    let geocoderViewModel = this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel;

    this.isSearchingSubject = new BehaviorSubject<boolean>(false);
    this.isSearchingSubscription = this.isSearchingSubject.subscribe((isSearching) => {
      if (!isSearching) {
        let geocoderViewModel = this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel;
        let suggestions = geocoderViewModel.suggestions;
        while (this.suggestionNames.length > 0) {
          this.suggestionNames.pop();
        }
        for (const suggestion of suggestions) {
          this.suggestionNames.push(suggestion);
        }

        let stringSimilarity = require("string-similarity");
        this.suggestionNames.sort((a: GeocoderSuggestion, b: GeocoderSuggestion): number => {
          return stringSimilarity.compareTwoStrings(a.displayName, b.displayName);
        })

        this.filteredSuggestionNames = of(this.suggestionNames);
      }
    });

    this.inputControl.valueChanges.pipe(
      startWith(''),
      // debounceTime(100),
      map(value => {
        geocoderViewModel._searchText = value;
        this.isSearchingSubject.next(geocoderViewModel.isSearchInProgress);
        return;
      })
    ).subscribe();

  }

  ngOnDestroy() {
    this.isSearchingSubscription.unsubscribe();
  }

  onNoClick() {
    this.data.confirmed = false;
    this.onClick();
  }

  onYesClick() {
    this.data.confirmed = true;
    this.onClick();
  }

  private onClick() {
    if (this.suggestionNames.length === 0) {
      return;
    }

    // this.data.search = this.inputControl.value;
    // Always get the first option in the autocomplete list by default
    this.data.search = this.suggestionNames[0].destination;
    this.logger.debug('User\'s search input: ' + this.data.search);
    this.dialogRef.close();

    // Send search request
    //if (this.data.search == null) {
    //  return;
    //}

    //let geocoderViewModel = this.GLOBALS!.CESIUM_VIEWER.geocoder.viewModel;
    //geocoderViewModel._searchText = this.data.search;
    //geocoderViewModel.search().afterExecute.addEventListener(() => {
    //  this.logger.debug(this.data.search + ' found');
    //});

    // TODO Check camera in browser after flyTo is complete
    this.GLOBALS!.CESIUM_CAMERA.flyTo({
      destination: this.data.search
    });
  }
}

interface GeocoderSuggestion {
  displayName: string,
  destination: any
}
