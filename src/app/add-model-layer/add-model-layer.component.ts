import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LogService} from "../../services/log.service";
import {ModelLayerOptionsType} from "../../core/ModelLayer";
import {GlobalService} from "../../services/global.service";
import {CitydbLayer} from "../../core/CitydbLayer";
import {AbstractControl, FormControl, ValidationErrors, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-model-layer',
  templateUrl: './add-model-layer.component.html',
  styleUrls: ['./add-model-layer.component.css']
})
export class AddModelLayerComponent {
  static opened: boolean = false;
  name: string;
  url: string;

  constructor(
    public dialog: MatDialog,
    private LOGGER?: LogService,
    private GLOBAL?: GlobalService
  ) {
    this.name = '';
    this.url = '';
  }

  handleAddModelLayer() {
    if (!AddModelLayerComponent.opened) {
      const dialogRef = this.dialog.open(AddModelLayerContentComponent,
        {
          data: {
            name: this.name,
            url: this.url
          }
        });
      AddModelLayerComponent.opened = true;

      dialogRef.afterClosed().subscribe(async data => {
        AddModelLayerComponent.opened = false;
        if (data != null) {
          await this.GLOBAL!.GLOBE.addKMLModelLayer(new CitydbLayer(data)); // TODO Add generalized layer, not only KML
        }
      });
    }
  }
}

@Component({
  selector: 'app-add-model-layer-content',
  templateUrl: './add-model-layer-content.component.html',
  styleUrls: ['./add-model-layer-content.component.css']
})
export class AddModelLayerContentComponent {
  name = new FormControl('', [Validators.required]);
  url = new FormControl('', [Validators.required,
    AddModelLayerContentComponent.urlValidator,
    AddModelLayerContentComponent.urlFileExtensionValidator]);

  constructor(
    public dialogRef: MatDialogRef<AddModelLayerContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModelLayerOptionsType,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getNameErrorMessage() {
    if (this.name.hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }

  getUrlErrorMessage() {
    if (this.url.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.url.hasError('patternUrl')) {
      return 'Not a valid URL';
    }

    if (this.url.hasError('patternUrlFileExtension')) {
      return 'The URL must refer to a .json, .kml, .kmz or .czml file'; // TODO Update list of allowed file extensions
    }

    return '';
  }

  // https://stackoverflow.com/a/65643961/5360833
  private static urlValidator({value}: AbstractControl): null | ValidationErrors {
    try {
      new URL(value);
      return null;
    } catch {
      return {patternUrl: true};
    }
  }

  private static urlFileExtensionValidator({value}: AbstractControl): null | ValidationErrors {
    try {
      const fileExtension = (new URL(value)).toString().split('.').pop();
      if (fileExtension == null || fileExtension.trim() === '') {
        throw new Error();
      }
      let allowedFileExtensions = ['json', 'kml', 'kmz', 'czml']; // TODO Update list of allowed file extensions
      if (!allowedFileExtensions.includes(fileExtension.trim().toLowerCase())) {
        throw new Error();
      }
      return null;
    } catch {
      return {patternUrlFileExtension: true};
    }
  }
}
