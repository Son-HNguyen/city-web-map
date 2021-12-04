import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LogService} from "../../services/log.service";
import {LayerTypes, ModelLayer, ModelLayerOptionsType} from "../../core/ModelLayer";
import {GlobalService} from "../../services/global.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-add-model-layer',
  templateUrl: './add-model-layer.component.html',
  styleUrls: ['./add-model-layer.component.css']
})
export class AddModelLayerComponent implements OnInit {
  static opened: boolean = false;
  name: string;
  type: LayerTypes;
  url: string;
  tags: Array<string>;
  description: string;

  constructor(
    public dialog: MatDialog,
    private LOGGER?: LogService,
    private GLOBAL?: GlobalService
  ) {
    this.name = '';
    this.type = LayerTypes.CITYDB_TILES;
    this.url = '';
    this.tags = new Array<string>();
    this.description = '';
  }

  async ngOnInit(): Promise<void> {
    // Add model layers saved from previous sessions to the globe
    for (const modelLayer of this.GLOBAL!.WORKSPACE.modelLayers) {
      if (modelLayer.activated) {
        await this.GLOBAL!.GLOBE.addModelLayer(modelLayer, false);
      }
    }
  }

  handleAddModelLayer() {
    if (!AddModelLayerComponent.opened) {
      const dialogRef = this.dialog.open(AddModelLayerContentComponent,
        {
          data: {
            name: this.name,
            type: this.type,
            url: this.url,
            tags: this.tags,
            description: this.description
          }
        });
      AddModelLayerComponent.opened = true;

      dialogRef.afterClosed().subscribe(async data => {
        AddModelLayerComponent.opened = false;
        if (data != null) {
          // Store entered input for next time
          this.name = data.name;
          this.type = data.type;
          this.url = data.url;
          this.tags = data.tags;
          this.description = data.description;
          // Create model layer and add to the globe
          let modelLayer: ModelLayer = await this.GLOBAL!.GLOBE.addModelLayer(data, true);
          // Add layer to the list in workspace
          this.GLOBAL!.WORKSPACE.modelLayers.push(modelLayer);
          modelLayer.activated = true; // TODO Add option to deactivate model layers

          // TODO Display layer list

          // TODO Save the camera position for this layer

          // TODO Add a drop down list to choose the type of layers
          // TODO Based on the selected layer, adjust the form control validators for URL (.json, .kml, etc.)

          // TODO Add an option to fly to the layer after adding

          // TODO Save the current camera after flying to the layer to the list of layers for later


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
  name: string;
  type: string = LayerTypes.CITYDB_TILES;
  types = [
    {value: LayerTypes.KML, viewValue: 'KML (.kml, .kmz, .czml)'},
    {value: LayerTypes.CITYDB_TILES, viewValue: '3DCityDB Tiles (.json)'},
    {value: LayerTypes.CESIUM_3D_TILES, viewValue: 'Cesium 3D Tiles (.json)'}
  ];
  url: string;

  // Tags
  tagSelectable: boolean = false;
  tagRemovable: boolean = true;
  tagAddOnBlur: boolean = true;
  readonly tagSeparatorKeysCodes = [ENTER, COMMA] as const;
  tags: Array<string>;
  description: string;

  modelLayerForm: FormGroup;
  tagInputControl: FormControl;

  constructor(
    fb: FormBuilder,
    public dialogRef: MatDialogRef<AddModelLayerContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModelLayerOptionsType,
    private GLOBAL?: GlobalService
  ) {
    this.name = data.name;
    this.type = data.type;
    this.url = data.url.toString();
    this.tags = new Array<string>();
    this.description = data.description;

    this.modelLayerForm = fb.group({
      name: new FormControl(this.name, [Validators.required]),
      type: new FormControl(this.type, [Validators.required]),
      url: new FormControl(this.url, [Validators.required, this.urlDuplicateValidator.bind(this)]),
      tags: new FormControl(this.tags, [this.tagDuplicateValidator.bind(this)]),
      description: new FormControl(this.description)
    });
    // Auxiliary control to update mat-chip-list regularly
    this.tagInputControl = new FormControl('', [this.tagInputValidator.bind(this)]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    const {value, valid} = this.modelLayerForm;
    if (valid) {
      this.dialogRef.close(value);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value != null && value.length > 0) {
      if (!this.tags.includes(value)) {
        this.tags.push(value);
        // Clear the input value
        event.chipInput!.clear();
      }
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  dropTag(event: CdkDragDrop<Array<string>>) {
    moveItemInArray(this.tags, event.previousIndex, event.currentIndex);
  }

  getNameErrorMessage() {
    if (this.modelLayerForm.controls.name.hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }

  getUrlErrorMessage() {
    if (this.modelLayerForm.controls.url.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.modelLayerForm.controls.url.hasError('patternInvalidUrl')) {
      return 'Not a valid URL';
    }

    if (this.modelLayerForm.controls.url.hasError('patternEmptyFileExtension')) {
      return 'The URL must refer to a file';
    }

    if (this.modelLayerForm.controls.url.hasError('patternUrlKMLFileExtension')) {
      return 'The URL must refer to a .kml, .kmz or .czml file'; // TODO Update list of allowed file extensions
    }

    if (this.modelLayerForm.controls.url.hasError('patternUrlCityDBTilesFileExtension')) {
      return 'The URL must refer to a .json file'; // TODO Update list of allowed file extensions
    }

    if (this.modelLayerForm.controls.url.hasError('patternUrlCesium3DTilesFileExtension')) {
      return 'The URL must refer to a .json file'; // TODO Update list of allowed file extensions
    }

    if (this.modelLayerForm.controls.url.hasError('patternDuplicateUrl')) {
      return 'A model layer with the same URL already exists';
    }

    return '';
  }

  getTagErrorMessage() {
    if (this.modelLayerForm.controls.tags.hasError('patternDuplicateTag')) {
      return 'This tag already exists';
    }

    return '';
  }

  private urlDuplicateValidator({value}: AbstractControl): null | ValidationErrors {
    try {
      // Check whether the file extension is correct based on the selected layer type
      const fileExtension = (new URL(value)).toString().split('.').pop();
      if (fileExtension == null || fileExtension.trim() === '') {
        return {patternEmptyFileExtension: true};
      }
      let allowedFileExtensions: Array<string> = [];
      switch (this.type) {
        case LayerTypes.KML:
          allowedFileExtensions = ['kml', 'kmz', 'czml'];
          if (!allowedFileExtensions.includes(fileExtension.trim().toLowerCase())) {
            return {patternUrlKMLFileExtension: true};
          }
          break;
        case LayerTypes.CITYDB_TILES:
          allowedFileExtensions = ['json'];
          if (!allowedFileExtensions.includes(fileExtension.trim().toLowerCase())) {
            return {patternUrlCityDBTilesFileExtension: true};
          }
          break;
        case LayerTypes.CESIUM_3D_TILES:
          allowedFileExtensions = ['json'];
          if (!allowedFileExtensions.includes(fileExtension.trim().toLowerCase())) {
            return {patternUrlCesium3DTilesFileExtension: true};
          }
          break;
      }
      // Check whether a to-be-added layer has already been inserted (based on the unique URLs)
      let modelLayer: ModelLayer;
      for (modelLayer of this.GLOBAL!.WORKSPACE.modelLayers) {
        if (new URL(modelLayer.url).pathname === new URL(value).pathname) {
          return {patternDuplicateUrl: true};
        }
      }
    } catch (error) {
      return {patternInvalidUrl: true};
    }
    return null;
  }

  private tagInputValidator({value}: AbstractControl): null | ValidationErrors {
    // The mat-chip-list is not updated as regularly as other inputs --> force update by using patchValue
    this.modelLayerForm.patchValue({tags: this.tags});
    return null;
  }

  private tagDuplicateValidator({value}: AbstractControl): null | ValidationErrors {
    // value is this.tags
    if (value != null && value.length > 0 && this.tagInputControl != null
      && this.tagInputControl.value.trim().length > 0) {
      if (value.includes(this.tagInputControl.value.trim())) {
        return {patternDuplicateTag: true};
      }
    }
    return null;
  }
}
