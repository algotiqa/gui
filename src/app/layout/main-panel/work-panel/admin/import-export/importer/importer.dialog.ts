//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatChipsModule} from "@angular/material/chips";
import {FileUploader} from "../../../../../../component/form/file-uploader/file-uploader";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {InventoryService} from "../../../../../../service/inventory.service";
import {
  ImportExecutionSpec,
  ImportOverviewResponse, ImportOverviewSpec, ImportPlan,
  ReferencedItem, SelectedReference, SelectedTradingSystem,
  TradingSystemItem
} from "../../../../../../model/importer";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {ReferencesPanel} from "./references.panel";
import {FlatButton} from "../../../../../../component/form/flat-button/flat-button";

//=============================================================================

@Component({
  selector: 'importer-dialog',
  templateUrl: 'importer.dialog.html',
  styleUrls: ['importer.dialog.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatGridListModule,
    MatIconModule, FileUploader, MatProgressBarModule, MatChipsModule, FlexTablePanel, MatTab, MatTabGroup, ReferencesPanel, FlatButton]
})

//=============================================================================

export class TradingSystemImporterDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  res? : ImportOverviewResponse
  file : any

  progress = 0
  buttonsDisabled = false

  columns        : FlexTableColumn[]   = [];
  tradingSystems : TradingSystemItem[] = [];
  selection      : TradingSystemItem[] = [];
  references     : ReferencedItem[]    = [];

  @ViewChild("fileUpload") fileUploader? : FileUploader

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService,
              private dialogRef       : MatDialogRef<TradingSystemImporterDialog>,
              private snackBar        : MatSnackBar) {

    super(eventBusService, labelService, router, "dialog.import", "");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("page.dialog.import.tradingSystem");

    this.columns = [
      new FlexTableColumn(ts, "name", undefined, undefined, undefined, true),
      new FlexTableColumn(ts, "timeframe"),
    ]
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

  onUpload() {
    this.buttonsDisabled = true

    let spec = new ImportOverviewSpec()

    this.inventoryService.importTradingSystemsOverview(spec, this.file).subscribe(
      event => {
        if (event.isInProgress()) {
          this.progress = event.percentage
        }

        else if (event.isInError()) {
          this.snackBar.open(this.loc("error") +" : "+ event.error, this.button("ok"))
          this.dialogRef.close(true)
          this.buttonsDisabled = false
        }
        else if (event.isCompleted()) {
          if (event.result != null) {
            this.res            = event.result
            this.tradingSystems = event.result.tradingSystems
            this.references     = event.result.referencedItems
          }
          this.buttonsDisabled = false
        }
      })
  }

  //-------------------------------------------------------------------------

  onImport() {
    this.buttonsDisabled = true

    let plan = new ImportPlan()
    plan.tradingSystems  = this.createSelectedList()
    plan.referencedItems = this.createSelectedReferences()

    let spec = new ImportExecutionSpec()
    spec.plan = plan

    this.inventoryService.importTradingSystemsExecute(spec, this.file).subscribe(
      event => {
        if (event.isInProgress()) {
          this.progress = event.percentage
        }

        else if (event.isInError()) {
          this.snackBar.open(this.loc("error") +" : "+ event.error, this.button("ok"))
          this.dialogRef.close(true)
          this.buttonsDisabled = false
        }
        else if (event.isCompleted()) {
          let message = this.loc("success")
          this.snackBar.open(message, this.button("ok"))
          this.dialogRef.close(true)
        }
      })
  }

  //-------------------------------------------------------------------------

  onClose() {
    this.dialogRef.close(false)
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : TradingSystemItem[]) {
    this.selection = selection
  }

  //-------------------------------------------------------------------------
  //---
  //--- UI related
  //---
  //-------------------------------------------------------------------------

  public uploadDisabled() : boolean {
    return this.buttonsDisabled || (this.res != undefined) || (this.file == undefined)
  }

  //-------------------------------------------------------------------------

  public importDisabled() : boolean {
    return this.buttonsDisabled               ||
           this.res              == undefined ||
           this.selection        == undefined ||
           this.selection.length == 0         ||
           this.isBadData()
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

  private isBadData() : boolean {
    let badNames = this.tradingSystems.filter( ts => {
      return ts.name.length == 0
    }).length

    let badRefs = this.references.filter( ri => {
      return ri.status == 2
    }).length

    return (badNames > 0) || (badRefs > 0)
  }

  //-------------------------------------------------------------------------

  private createSelectedList() : SelectedTradingSystem[] {
    let list : SelectedTradingSystem[] = []

    this.tradingSystems.forEach(ts => {
      this.selection.forEach((item) => {
        if (ts.id == item.id) {
          let selTs : SelectedTradingSystem = {
            id  : ts.id,
            name: ts.name
          }
          list.push(selTs)
        }
      })
    })

    return list
  }

  //-------------------------------------------------------------------------

  private createSelectedReferences() : SelectedReference[] {
    let list : SelectedReference[] = []

    this.references.forEach(ri => {
      if (ri.status == 1) {
        //--- Status is 'Existing', we need to provide a mapping

        let selR : SelectedReference = {
          id      : ri.id,
          itemType: ri.itemType,
          mappedTo: ri.mappedTo
        }

        list.push(selR)
      }
    })

    return list
  }
}

//=============================================================================
