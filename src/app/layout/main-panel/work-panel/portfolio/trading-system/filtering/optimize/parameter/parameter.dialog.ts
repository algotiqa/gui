//=============================================================================
//===
//=== Copyright (C) 2024-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject, ChangeDetectionStrategy} from "@angular/core";
import {AbstractPanel} from "../../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../../service/label.service";
import {Router} from "@angular/router";
import {SelectRequired} from "../../../../../../../../component/form/select-required/select-required";
import { MatChipsModule} from "@angular/material/chips";
import {
  FilterOptimizationRequest,
} from "../../../../../../../../model/filtering";
import {MatCheckboxModule} from "@angular/material/checkbox";

import {InputNumber} from "../../../../../../../../component/form/input-number/input-number";
import {PortfolioService} from "../../../../../../../../service/portfolio.service";
import {DialogData} from "../dialog-data";
import {MatTabsModule} from "@angular/material/tabs";
import {ParamPanel} from "./param-panel/param.panel";

//=============================================================================

@Component({
    selector: 'filter-parameter-dialog',
    templateUrl: 'parameter.dialog.html',
    styleUrls: ['parameter.dialog.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogModule, MatButtonModule, SelectRequired, MatChipsModule, MatCheckboxModule, InputNumber, MatTabsModule, ParamPanel]
})

//=============================================================================

export class OptimizeParameterDialog extends AbstractPanel {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  options : FilterOptimizationRequest = new FilterOptimizationRequest()

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

    super(eventBusService, labelService, router, "portfolio.filtering");
    this.resetOptions()
    this.options.period = data.period
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  onReset() {
    this.resetOptions()
  }

  //-------------------------------------------------------------------------

  onRun() {
    this.portfolioService.startFilterOptimization(this.data.tsId, this.options).subscribe(
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
    let f = this.data.baseline
    let o = new FilterOptimizationRequest()
    o.filterConfig.enable(f)
    o.baseline = f

    this.options = o
  }
}

//=============================================================================
