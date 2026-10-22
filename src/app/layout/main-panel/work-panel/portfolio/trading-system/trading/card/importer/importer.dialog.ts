//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject, ChangeDetectionStrategy} from "@angular/core";
import {Router} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatChipsModule} from "@angular/material/chips";
import {AbstractPanel} from "../../../../../../../../component/abstract.panel";
import {FileUploader} from "../../../../../../../../component/form/file-uploader/file-uploader";
import {EventBusService} from "../../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../../service/label.service";
import {InventoryService} from "../../../../../../../../service/inventory.service";
import {FlatButton} from "../../../../../../../../component/form/flat-button/flat-button";
import {MatCheckbox} from "@angular/material/checkbox";
import {PorTradingSystem} from "../../../../../../../../model/model";
import {DialogData} from "./dialog-data";
import {TradeImportResponse, TradeImportSpec} from "../../../../../../../../model/importer";

//=============================================================================

@Component({
  selector: 'trade-importer-dialog',
  templateUrl: 'importer.dialog.html',
  styleUrls: ['importer.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatGridListModule,
    MatIconModule, FileUploader, MatProgressBarModule, MatChipsModule, FlatButton, MatCheckbox]
})

//=============================================================================

export class TradeImporterDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ts? : PorTradingSystem

  file : any

  spec = new TradeImportSpec()

  progress        = 0
  buttonsDisabled = false

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService,
              private dialogRef       : MatDialogRef<TradeImporterDialog>,
              private snackBar        : MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "dialog.tradeImport", "");
    this.ts = data.ts
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onFileChange(files : any[]) {
    if (files.length > 0) {
      this.file = files[0]
    }
    else {
      this.file = undefined
    }
  }

  //-------------------------------------------------------------------------

  onImport() {
    this.buttonsDisabled = true

    this.inventoryService.importTradesFromFile(this.ts?.id, this.spec, this.file).subscribe(
      event => {
        if (event.isInProgress()) {
          this.progress = event.percentage
        }

        else if (event.isInError()) {
          this.dialogRef.close(true)
        }
        else if (event.isCompleted()) {
          this.snackBar.open(this.buildResultMessage(event.result), this.button("ok"))
          this.dialogRef.close(true)
        }
      })
  }

  //-------------------------------------------------------------------------

  onClose() {
    this.dialogRef.close(false)
  }

  //-------------------------------------------------------------------------
  //---
  //--- UI related
  //---
  //-------------------------------------------------------------------------

  public importDisabled() : boolean {
    return this.buttonsDisabled || (this.file == undefined)
  }

  //-------------------------------------------------------------------------

  public closeDisabled() : boolean {
    return this.buttonsDisabled
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildResultMessage(res : TradeImportResponse|null) : string {
    let msg = this.loc("result") +" : "

    if (res != null) {
      msg = res.trades +" trades, "+ res.bars +" bars, "+ res.dailyReturns +" daily returns";
    }

    return msg
  }
}

//=============================================================================
