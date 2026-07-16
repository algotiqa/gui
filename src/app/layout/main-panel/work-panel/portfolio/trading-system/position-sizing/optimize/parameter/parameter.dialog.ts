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
import {SelectRequired} from "../../../../../../../../component/form/select-required/select-required";
import {MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";
import {FilterOptimizationRequest} from "../../../../../../../../model/filtering";
import {MatCheckboxModule} from "@angular/material/checkbox";

import {InputNumber} from "../../../../../../../../component/form/input-number/input-number";
import {PortfolioService} from "../../../../../../../../service/portfolio.service";
import {DialogData} from "../dialog-data";
import {MatTabsModule} from "@angular/material/tabs";
import {PositionOptimizationRequest, PositionTargets, RunConfig} from "../../../../../../../../model/position-sizing";
import {
  PeriodSelector,
  PeriodSelectorInfo
} from "../../../../../../../../component/form/period-selector/period-selector";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FormsModule} from "@angular/forms";

//=============================================================================

@Component({
    selector: 'position-parameter-dialog',
    templateUrl: 'parameter.dialog.html',
    styleUrls: ['parameter.dialog.scss'],
  imports: [MatDialogModule, MatButtonModule, SelectRequired, MatChipsModule, MatCheckboxModule, InputNumber, MatTabsModule, PeriodSelector, FormsModule]
})

//=============================================================================

export class OptimizeParameterDialog extends AbstractPanel {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  period = new PeriodSelectorInfo()
  req    = new PositionOptimizationRequest()

  positionRiskPerUnits : Object = {}

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private portfolioService: PortfolioService,
              private dialogRef       : MatDialogRef<OptimizeParameterDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "dialog.positionOptimization");
    this.resetOptions()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.positionRiskPerUnits = this.labelService.getLabel("map.positionRiskPerUnit")
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  runEnabled() : boolean {
    //TODO add field validation here
    return true
  }

  //-------------------------------------------------------------------------
  //--- Param spec
  //-------------------------------------------------------------------------

  minP(name:string) : number {
    return this.data.paramSpecs[name]?.minValue
  }

  //-------------------------------------------------------------------------

  maxP(name:string) : number {
    return this.data.paramSpecs[name]?.maxValue
  }

  //-------------------------------------------------------------------------

  optP(name:string) : boolean {
    return !this.data.paramSpecs[name]?.required
  }

  //-------------------------------------------------------------------------
  //--- Model spec
  //-------------------------------------------------------------------------

  minM(name:string) : number {
    return this.data.modelSpecs[name]?.minValue
  }

  //-------------------------------------------------------------------------

  maxM(name:string) : number {
    return this.data.modelSpecs[name]?.maxValue
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event handling
  //---
  //-------------------------------------------------------------------------

  onFixedUnitChange(e: MatChipSelectionChange) {
    this.req.modelConfig.enableFixedUnit = e.selected;
  }

  //-------------------------------------------------------------------------

  onPercentRiskChange(e: MatChipSelectionChange) {
    this.req.modelConfig.enablePercentRisk = e.selected;
  }

  //-------------------------------------------------------------------------

  onPercentVolChange(e: MatChipSelectionChange) {
    this.req.modelConfig.enablePercentVol = e.selected;
  }

  //-------------------------------------------------------------------------

  onMarketMoneyChange(e: MatChipSelectionChange) {
    this.req.modelConfig.enableMarketMoney = e.selected;
  }

  //-------------------------------------------------------------------------

  onReset() {
    this.resetOptions()
  }

  //-------------------------------------------------------------------------

  onRun() {
    this.req.runConfig.period = this.period.getSelectedPeriod()

    this.portfolioService.startPositionOptimization(this.data.tsId, this.req).subscribe(
      result => {
        this.dialogRef.close(true)
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private resetOptions() {
    this.req        = new PositionOptimizationRequest()
    this.req.params = structuredClone(this.data.params)
    this.period     = new PeriodSelectorInfo(this.data.period)
  }
}

//=============================================================================
