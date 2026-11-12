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
import {MatChipsModule} from "@angular/material/chips";
import {BaseConfig, Config, FilterRun} from "../../../../../../../../model/filtering";
import {MatCheckboxModule} from "@angular/material/checkbox";

import {PortfolioService} from "../../../../../../../../service/portfolio.service";
import {DialogData} from "../dialog-data";
import {FlexTablePanel} from "../../../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../../../../model/flex-table";
import {MatIconModule} from "@angular/material/icon";

//=============================================================================

@Component({
    selector: 'filter-result-dialog',
    templateUrl: 'result.dialog.html',
    styleUrls: ['result.dialog.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
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
  disUse  : boolean = true;
  runs    : FilterRun[] = [];
  selRun? : FilterRun

  steps?    : number
  duration? : string
  field     : string = ""
  baseValue?: number
  bestValue?: number
  startDate?: string

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

    super(eventBusService, labelService, router, "portfolio.filtering");

    this.portfolioService.getFilterOptimizationInfo(this.data.tsId).subscribe(
      res => {
        if (res.runs) {
          this.steps    = res.maxSteps
          this.duration = res.duration
          this.baseValue= res.baseValue
          this.bestValue= res.bestValue
          this.startDate= res.startDate
          // @ts-ignore
          this.field    = this.fieldToOptimize(res.fieldToOptimize)
          this.runs     = res.runs
          this.runs.forEach(run => {
            this.setDescriptions(run)
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
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : FilterRun[]) {
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
      run: this.selRun
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.filterOptimiz");

    this.columns = [
      new FlexTableColumn(ts, "fitnessValue"),
      new FlexTableColumn(ts, "netReturn"),
      new FlexTableColumn(ts, "avgTrade"),
      new FlexTableColumn(ts, "maxDrawdown"),
      new FlexTableColumn(ts, "activation"),
      new FlexTableColumn(ts, "deactivation"),
    ]
  }

  //-------------------------------------------------------------------------

  fieldToOptimize = (field : string) : string => {
    let list : { id:string, name:string }[] = this.labelService.getLabel("page.portfolio.filtering.params.fieldOptions")

    for (let i=0; i<list.length; i++) {
      if (list[i].id==field) {
        return list[i].name
      }
    }

    return "???"
  }

  //-------------------------------------------------------------------------

  private updateButtons = (selection : FilterRun[]) => {
    this.disUse = (selection.length != 1)

    if (selection.length == 1) {
      this.selRun = selection[0]
    }
  }

  //-------------------------------------------------------------------------

  private setDescriptions(run : FilterRun) {
    let f = run.filter

    run.activation   = this.calcDescription(f.activation)
    run.deactivation = this.calcDescription(f.deactivation)
  }

  //-------------------------------------------------------------------------

  private calcDescription(c : Config) : string {
    let mode = this.map("filterCombinationModeShort", c.combinationMode)

    let list : string[] = []

    this.addConfig(list, "NetRet"   , c.netReturn)
    this.addConfig(list, "AvgTrade" , c.averageTrade)
    this.addConfig(list, "EqVsAvg"  , c.equityVsAverage)
    this.addConfig(list, "Win%"     , c.winningPercentage)
    this.addConfig(list, "MaxDD"    , c.maxDrawdown)
    this.addConfig(list, "Trend"    , c.trendLine)
    this.addConfig(list, "ProfFact" , c.profitFactor)
    this.addConfig(list, "SR"       , c.sharpeRatio)
    this.addConfig(list, "SQN100"   , c.sqn100)
    this.addConfig(list, "Ret/MaxDD", c.returnMaxDDRatio)

    if (list.length == 0) {
      return ""
    }

    if (list.length == 1) {
      return list[0]
    }

    return mode +"[ "+ list.join(", ") +" ]"
  }

  //-------------------------------------------------------------------------

  private addConfig(list : string[], name : string, b : BaseConfig) {
    if (b.enabled) {
      list.push(name+ "(len="+ b.length +", val="+ b.value +")")
    }
  }
}

//=============================================================================
