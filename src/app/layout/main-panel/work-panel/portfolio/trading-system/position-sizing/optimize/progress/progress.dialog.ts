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

import {PortfolioService} from "../../../../../../../../service/portfolio.service";
import {DialogData} from "../dialog-data";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";
import {Subscription, timer} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {PositionOptimizationResponse} from "../../../../../../../../model/position-sizing";

//=============================================================================

@Component({
    selector: 'position-progress-dialog',
    templateUrl: 'progress.dialog.html',
    styleUrls: ['progress.dialog.scss'],
    imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatGridListModule, MatIconModule]
})

//=============================================================================

export class OptimizeProgressDialog extends AbstractPanel {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  res?        : PositionOptimizationResponse
  percentage? : number
  gain?       : number
  model       : {[key:string]:string} = {}

  private poller !: Subscription

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private portfolioService: PortfolioService,
              private dialogRef       : MatDialogRef<OptimizeProgressDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "dialog.positionOptimization");
    this.poller = timer(0, 1000).subscribe(
      result => this.refresh()
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.model = this.labelService.getLabel("map.positionModel")
  }

  //-------------------------------------------------------------------------

  protected override destroy = (): void => {
    this.poller.unsubscribe()
  }

  //-------------------------------------------------------------------------

  onAbort() {
    this.portfolioService.stopPositionOptimization(this.data.tsId).subscribe(
      result => {
        console.log("Position optimization stopped")
        this.dialogRef.close(true)
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private refresh() {
    this.portfolioService.getPositionOptimizationInfo(this.data.tsId).subscribe(
      result => {
        console.log("Polled")
        this.res = result

        if (this.res.currStep && this.res.totalSteps) {
          this.percentage = Math.floor(this.res.currStep * 100 / this.res.totalSteps)
        }

        if (result.status == "completed"){
          this.dialogRef.close(true)
        }
      }
    )
  }
}

//=============================================================================
