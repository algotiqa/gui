//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {LocalService} from "../../../service/local.service";
import {QualityAnalysisResponse} from "../../../model/quality";
import {Details, Distribution, SimulationRequest, SimulationResult} from "../../../model/simulation";
import {FlatButton} from "../../../component/form/flat-button/flat-button";
import {ApexPlotOptions, ChartComponent} from "ng-apexcharts";
import {ChartOptions} from "../../../lib/chart-lib";
import {PorTradingSystem} from "../../../model/model";
import {Lib} from "../../../lib/lib";
import {DataProductSelectorDialog} from "../../../component/form/data-product-selector/product-selector.dialog";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {DialogData} from "../../../layout/main-panel/work-panel/admin/connection/login/dialog-data";
import {SimulationInfoDialog} from "./info.dialog";

//=============================================================================

@Component({
  selector: 'simulation-results',
  templateUrl: './results.panel.html',
  styleUrls:  ['./results.panel.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    FlatButton,
    ChartComponent,
  ]
})

//=============================================================================

export class SimulationResultsPanel extends AbstractPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  @Input() ts? : PorTradingSystem

  @Input()
  set res(res : SimulationResult|undefined) {
    this._res = res
    this.rebuild()
  }

  get res() : SimulationResult|undefined {
    return this._res
  }

  _res? : SimulationResult

  @Output() rerunChange = new EventEmitter();

  //---------------------------------------------------------------------------

  tradeType   = new FormControl("all")
  returnType  = new FormControl("net")
  viewType    = new FormControl("equity")

  distribOptions : ChartOptions;
  probabOptions  : ChartOptions;

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService      : EventBusService,
              labelService         : LabelService,
              router               : Router,
              private localService : LocalService,
              public  dialog       : MatDialog) {
    super(eventBusService, labelService, router, "module.simulation.result")

    this.distribOptions = this.buildDistribChartOptions()
    this.probabOptions  = this.buildProbabChartOptions()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.rebuild()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  details() : Details|undefined {
    let tradeType  = this.tradeType.value
    let returnType = this.returnType.value

    //--- All

    if (tradeType == "all") {
      if (returnType == "gross") {
        return this.res?.grossAll
      }

      return this.res?.netAll
    }

    //--- Long

    if (tradeType == "long") {
      if (returnType == "gross") {
        return this.res?.grossLong
      }

      return this.res?.netLong
    }

    //--- Short

    if (returnType == "gross") {
      return this.res?.grossShort
    }

    return this.res?.netShort
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onViewChange() {
    this.rebuild()
  }

  //-------------------------------------------------------------------------

  onInfoClick() {
    this.dialog.open(SimulationInfoDialog, {
      minWidth: "512px",
      data: this._res
    })
  }

  //-------------------------------------------------------------------------

  onReRunClick() {
    this.rerunChange.emit()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildDistribChartOptions() : ChartOptions {
    return Lib.chart.buildBarOptions({
      title: {
        text: this.loc("distribTitle")
      },
      yaxis: {
        decimalsInFloat: 0,
        title: {
          text: this.loc("maxDDCount")
        }
      },
    })
  }

  //-------------------------------------------------------------------------

  private buildProbabChartOptions() : ChartOptions {
    return Lib.chart.buildBarOptions({
      title: {
        text: this.loc("probabTitle")
      },
      yaxis: {
        title: {
          text: this.loc("probabPercent")
        }
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: this.tipFormatter
        }
      }
    })
  }

  //-------------------------------------------------------------------------

  tipFormatter = (val: any, opts?: any): string => {
    let msg1 = this.loc("probMsg1")
    let msg2 = this.loc("probMsg2")
    let msg3 = this.loc("probMsg3")
    let perc  = opts.series[0][opts.dataPointIndex]
    let risk = this.details()?.detectedRisk
    if (risk == undefined) {
      risk = 0
    }
    let rMult = Number(val.substring(0, val.length - 1))
    let dd =  (rMult * risk) +" "+ this.ts?.currencyCode

    return `<div>${msg1} <b>${perc}%</b> ${msg2} <br> ${msg3} <b>${val} ( ${dd} )</b></div>`
  }

  //-------------------------------------------------------------------------
  //--- Rebuilding
  //-------------------------------------------------------------------------

  private rebuild() {
    let details = this.details()
    this.rebuildDistribChart(details)
    this.rebuildProbabChart (details)
  }

  //-------------------------------------------------------------------------

  private rebuildDistribChart(details: Details|undefined) {
    if (details == undefined || details.maxDrawdownDistr == undefined) {
      this.distribOptions.series = []
      return
    }

    this.distribOptions.series = [{
      name: this.loc("distribSerie"),
      data: details.maxDrawdownDistr.yAxis,
    }]

    this.distribOptions.xaxis = {
      type: "category",
      categories: details.maxDrawdownDistr.xAxis,
      tickAmount: 50,
    }
  }

  //-------------------------------------------------------------------------

  private rebuildProbabChart(details: Details|undefined) {
    if (details == undefined || details.maxDrawdownProb == undefined) {
      this.probabOptions.series = []
      return
    }

    this.probabOptions.series = [{
      name: this.loc("probabSerie"),
      data: details.maxDrawdownProb.yAxis,
    }]

    this.probabOptions.xaxis = {
      type      : "category",
      categories: details.maxDrawdownProb.xAxis,
      tickAmount: 50,
      tooltip: {
        enabled: true,
        formatter: this.tipFormatter
      }
    }
  }
}

//=============================================================================
