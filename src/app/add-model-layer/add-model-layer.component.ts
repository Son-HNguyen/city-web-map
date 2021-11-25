import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LogService} from "../../services/log.service";
import {ModelLayerOptionsType} from "../../core/ModelLayer";
import {GlobalService} from "../../services/global.service";
import {CitydbLayer} from "../../core/CitydbLayer";

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
        await this.GLOBAL!.GLOBE.addKMLModelLayer(new CitydbLayer(data)); // TODO Add generalized layer, not only KML
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
  constructor(
    public dialogRef: MatDialogRef<AddModelLayerContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModelLayerOptionsType,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
