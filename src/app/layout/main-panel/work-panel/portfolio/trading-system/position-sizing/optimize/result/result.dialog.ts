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
import {Component, Inject} from "@angular/core";
import {AbstractPanel} from "../../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../../service/label.service";
import {Router} from "@angular/router";
import {MatChipsModule} from "@angular/material/chips";
import {MatCheckboxModule} from "@angular/material/checkbox";

import {PortfolioService} from "../../../../../../../../service/portfolio.service";
import {DialogData} from "../dialog-data";
import {FlexTablePanel} from "../../../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../../../../model/flex-table";
import {MatIconModule} from "@angular/material/icon";
import {ExecutionResult, PositionOptimizationResponse} from "../../../../../../../../model/position-sizing";

//=============================================================================

@Component({
    selector: 'position-result-dialog',
    templateUrl: 'result.dialog.html',
    styleUrls: ['result.dialog.scss'],
    imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatCheckboxModule, FlexTablePanel, MatIconModule]
})

//=============================================================================

export class OptimizeResultDialog extends AbstractPanel {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns : FlexTableColumn[] = [];
  results : ExecutionResult[] = []
  selRes? : ExecutionResult
  disUse  : boolean = true;

  res? : PositionOptimizationResponse

  positionModels  : {[key:string]:string} = {}

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private portfolioService: PortfolioService,
              private dialogRef       : MatDialogRef<OptimizeResultDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "dialog.positionOptimization");

    this.portfolioService.getPositionOptimizationInfo(this.data.tsId).subscribe(
      res => {
        this.res = res

        if (res.results) {
          this.results  = res.results
          this.results.forEach(run => {
            this.calcDescription(run)
          })
        }
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.positionModels = this.labelService.getLabel("map.positionModel")
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : ExecutionResult[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onRestart() {
    this.dialogRef.close({
      run: null
    })
  }

  //-------------------------------------------------------------------------

  onUse() {
    this.dialogRef.close({
      result: this.selRes
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.positionOptimiz");

    this.columns = [
      new FlexTableColumn(ts, "modelName"),
      new FlexTableColumn(ts, "params"),
      new FlexTableColumn(ts, "probOfSuccess"),
      new FlexTableColumn(ts, "probOfFailure"),
    ]
  }

  //-------------------------------------------------------------------------

  private updateButtons = (selection : ExecutionResult[]) => {
    this.disUse = (selection.length != 1)

    if (selection.length == 1) {
      this.selRes = selection[0]
    }
  }

  //-------------------------------------------------------------------------

  private calcDescription(er : ExecutionResult) {
    er.modelName = this.positionModels[er.model]

    switch (er.model) {
      case "FU":
        er.params = "Units:"+ er.config["units"]
        break

      case "PR":
        er.params = "RiskPerTrade:"+ er.config["riskPerTrade"]+"%"
        break

      case "PV":
        er.params = "AvgLen:"+ er.config["averageLength"]+", MaxVol:"+ er.config["maxVolatility"]+"%"
        break

      case "MM":
        er.params = "RiskOnCap:"+ er.config["riskPerTradeOnCap"]+"%, RiskOnEarn:"+ er.config["riskPerTradeOnEarn"]+"%, PercOnCap:"+ er.config["percentageOnCapital"]+"%"
        break
    }
  }
}

//=============================================================================
