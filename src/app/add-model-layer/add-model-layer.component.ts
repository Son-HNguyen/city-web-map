import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LogService} from "../../services/log.service";
import {LayerTypes, ModelLayer, ModelLayerOptionsType} from "../../core/ModelLayer";
import {GlobalService} from "../../services/global.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatAccordion} from "@angular/material/expansion";
import {AddedModelLayerAndObjectOnGlobeType} from "../../globe/Globe";

@Component({
  selector: 'app-add-model-layer',
  templateUrl: './add-model-layer.component.html',
  styleUrls: ['./add-model-layer.component.css']
})
export class AddModelLayerComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  static opened: boolean = false;
  name: string;
  type: LayerTypes;
  url: string;
  tags: Array<string>;
  description: string;
  activated: boolean;

  // Store model layer representation on globe only locally in runtime, not in Workspace
  modelLayerObjectsOnGlobe: Array<any>;

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
    this.activated = true;
    this.modelLayerObjectsOnGlobe = [];
  }

  async ngOnInit(): Promise<void> {
    // Add model layers saved from previous sessions to the globe
    for (const modelLayer of this.GLOBAL!.WORKSPACE.modelLayers) {
      await this.addModelLayer(modelLayer, false);
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
            description: this.description,
            activated: this.activated
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
          this.activated = data.activated;
          let addedModelLayerAndObjectOnGlobe = await this.addModelLayer(data);

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

  private addModelLayer(options: ModelLayerOptionsType | ModelLayer, update?: boolean):
    Promise<AddedModelLayerAndObjectOnGlobeType> {
    return new Promise<AddedModelLayerAndObjectOnGlobeType>(async (resolve, reject) => {
      try {
        // Create model layer and add to the globe
        let addedModelLayerAndObjectOnGlobe = await this.GLOBAL!.GLOBE.addModelLayer(options, update == null || update);
        let modelLayer: ModelLayer = addedModelLayerAndObjectOnGlobe.modelLayer;
        let objectOnGlobe: any = addedModelLayerAndObjectOnGlobe.objectOnGlobe;
        // Add layer to the list in workspace
        if (update == null || update) {
          this.GLOBAL!.WORKSPACE.modelLayers.push(modelLayer);
        }
        this.modelLayerObjectsOnGlobe.push(objectOnGlobe);
        // Activate/Show on globe
        if (options.activated) {
          this.GLOBAL!.GLOBE.activateModelLayer(objectOnGlobe); // TODO Add option to deactivate model layers
        }
        resolve({modelLayer, objectOnGlobe});
      } catch (error) {
        reject();
      }
    })
  }

  private findIndexModelLayer(modelLayer: ModelLayer) {
    return this.GLOBAL!.WORKSPACE.modelLayers.findIndex(
      element => new URL(element.url).pathname === new URL(modelLayer.url).pathname
    );
  }

  handleCurrentModelLayerToggleVisibility(event: MouseEvent, modelLayer: ModelLayer) {
    // Prevent expanding/closing panel when this button has been clicked
    event.stopPropagation();

    const index = this.findIndexModelLayer(modelLayer);
    const modelLayerObjectOnGlobe = this.modelLayerObjectsOnGlobe[index];
    if (modelLayer.activated) {
      this.GLOBAL!.GLOBE.deactivateModelLayer(modelLayerObjectOnGlobe);
    } else {
      this.GLOBAL!.GLOBE.activateModelLayer(modelLayerObjectOnGlobe);
    }
    modelLayer.activated = !modelLayer.activated;
  }

  handleCurrentModelLayerFlyTo(event: MouseEvent, modelLayer: ModelLayer) {
    // Prevent expanding/closing panel when this button has been clicked
    event.stopPropagation();

    const index = this.findIndexModelLayer(modelLayer);
    const modelLayerObjectOnGlobe = this.modelLayerObjectsOnGlobe[index];
    this.GLOBAL!.GLOBE.flyToObjects(modelLayerObjectOnGlobe);
  }

  handleCurrentModelLayerEdit(event: MouseEvent) {
    // Prevent expanding/closing panel when this button has been clicked
    event.stopPropagation();

    // TODO
  }

  handleCurrentModelLayerCopy(event: MouseEvent) {
    // Prevent expanding/closing panel when this button has been clicked
    event.stopPropagation();

    // TODO
  }

  handleCurrentModelLayerDelete(event: MouseEvent) {
    // Prevent expanding/closing panel when this button has been clicked
    event.stopPropagation();

    // TODO
  }
}

@Component({
  selector: 'app-add-model-layer-content',
  templateUrl: './add-model-layer-content.component.html',
  styleUrls: ['./add-model-layer-content.component.css']
})
export class AddModelLayerContentComponent implements OnInit {
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
  activated: boolean;

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
    this.activated = data.activated;

    this.modelLayerForm = fb.group({
      name: new FormControl(this.name, [Validators.required]),
      type: new FormControl(this.type, [Validators.required]),
      url: new FormControl(this.url, [Validators.required, this.urlDuplicateValidator.bind(this)]),
      tags: new FormControl(this.tags, [this.tagDuplicateValidator.bind(this)]),
      description: new FormControl(this.description),
      activated: new FormControl(this.activated)
    });
    // Auxiliary control to update mat-chip-list regularly
    this.tagInputControl = new FormControl('', []);
  }

  ngOnInit(): void {
    this.tagInputControl.valueChanges.subscribe(value => {
      // The mat-chip-list is not updated as regularly as other inputs --> force update by using patchValue
      this.modelLayerForm.patchValue({tags: this.tags});
    })
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
