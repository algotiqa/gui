//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {ApexAnnotations, ApexStroke, ApexXAxis, ChartComponent, XAxisAnnotations} from "ng-apexcharts";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {ToggleButton} from "../../../component/form/toggle-button/toggle-button";
import {ChartOptions} from "../../../lib/chart-lib";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {LocalService} from "../../../service/local.service";
import {Setting} from "../../../model/setting";
import {Lib} from "../../../lib/lib";
import {PerfEquities, PerformanceAnalysisResponse} from "../../../model/performance";
import {IntDateAdapter} from "../../../component/form/date-picker/int-date-adapter";

//=============================================================================

@Component({
  selector: 'performance-chart-panel',
  templateUrl: './chart.panel.html',
  styleUrls: ['./chart.panel.scss'],
  imports: [
    ChartComponent,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    ToggleButton
  ]
})

//=============================================================================

export class PerformanceChartPanel extends AbstractPanel {
  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  @Input()
  set par(par : PerformanceAnalysisResponse) {
    this._par = par
    this.rebuildChart()
  }

  get par() : PerformanceAnalysisResponse|undefined {
    return this._par
  }

  _par? : PerformanceAnalysisResponse

  //---------------------------------------------------------------------------

  tradeType    = new FormControl("all")
  profitType   = new FormControl("all")
  chartType    = new FormControl("time")
  showDrawdown = true
  showSteps    = true

  chartOptions : ChartOptions;

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService      : EventBusService,
              labelService         : LabelService,
              router               : Router,
              private localService : LocalService) {
    super(eventBusService, labelService, router, "module.performance.chart", "")

    this.chartOptions  = this.buildChartOptions()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.tradeType .setValue(this.localService.getStringItem(Setting.Portfolio_TradSys_PerfTrade,  "all"))
    this.profitType.setValue(this.localService.getStringItem(Setting.Portfolio_TradSys_PerfProfit, "all"))
    this.chartType .setValue(this.localService.getStringItem(Setting.Portfolio_TradSys_PerfChart, "time"))

    this.showDrawdown = this.localService.getStringItem(Setting.Portfolio_TradSys_PerfDdown, "true") == "true"

    this.updateChartType()
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onTradeTypeChange() {
    let value = this.tradeType.value
    this.localService.setStringItem(Setting.Portfolio_TradSys_PerfTrade, value)
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onProfitTypeChange() {
    let value = this.profitType.value
    this.localService.setStringItem(Setting.Portfolio_TradSys_PerfProfit, value)
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onDrawdownChange() {
    this.localService.setStringItem(Setting.Portfolio_TradSys_PerfDdown, this.showDrawdown+"")
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onChartTypeChange() {
    let value = this.chartType.value
    this.localService.setStringItem(Setting.Portfolio_TradSys_PerfChart, value)
    this.updateChartType()
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onStepsChange() {
    if (this.showSteps) {
      this.chartOptions.stroke = <ApexStroke>{
        curve: "stepline",
        width: 2,
      }
    }
    else {
      this.chartOptions.stroke = <ApexStroke>{
        curve: "straight",
        width: 2,
      }
    }

    // this.rebuildChart()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildChartOptions() : ChartOptions {
    return Lib.chart.buildLineOptions({
      yaxis: {
        tickAmount: 20,
        decimalsInFloat: 0,
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        }
      },
      grid: {
        borderColor: "#B0B0B0",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: true
          }
        }
      }
    })
  }

  //-------------------------------------------------------------------------

  private rebuildChart() {
    let datasets : any[] = []
    let equs = this.getEquities()

    if (equs != undefined) {
      let xAxis = this.getXAxis(equs.time)

      if (this.shouldShowGrossEquity()) {
        datasets = [...datasets, Lib.chart.buildDataset(this.loc("grossEquity"), xAxis, equs.grossEquity, false, "#808080")]
      }

      if (this.shouldShowNetEquity()) {
        datasets = [...datasets, Lib.chart.buildDataset(this.loc("netEquity"), xAxis, equs.netEquity, false, "#008FFB")]
      }

      if (this.showDrawdown) {
        if (this.shouldShowGrossEquity()) {
          datasets = [...datasets, Lib.chart.buildDataset(this.loc("grossDrawdown"), xAxis, equs.grossDrawdown, true)]
        }

        if (this.shouldShowNetEquity()) {
          datasets = [...datasets, Lib.chart.buildDataset(this.loc("netDrawdown"), xAxis, equs.netDrawdown, true)]
        }
      }
    }

    this.chartOptions.series      = datasets
    this.chartOptions.annotations = this.rebuildAnnotations()
  }

  //-------------------------------------------------------------------------

  private getEquities() : PerfEquities|undefined {
    let equs = this._par?.allEquities

    if (this.tradeType.value == "long") {
      equs = this._par?.longEquities
    }
    else if (this.tradeType.value == "short") {
      equs = this._par?.shortEquities
    }

    return equs
  }

  //-------------------------------------------------------------------------

  private shouldShowGrossEquity() : boolean {
    return this.profitType.value == "all" || this.profitType.value == "gross"
  }

  //-------------------------------------------------------------------------

  private shouldShowNetEquity() : boolean {
    return this.profitType.value == "all" || this.profitType.value == "net"
  }

  //-------------------------------------------------------------------------

  private updateChartType() {
    if (this.chartType.value == "trade") {
      this.chartOptions.xaxis = <ApexXAxis>{
        type:"numeric",
        tickAmount: 20,
        decimalsInFloat: 0,
      }
    }
    else {
      this.chartOptions.xaxis = <ApexXAxis>{
        type:"datetime",
      }
    }
  }

  //-------------------------------------------------------------------------

  private getXAxis(time : Date[]) : any[] {
    if (this.chartType.value == "time") {
      return time
    }

    let axis : number[] = new Array(time.length)
    for (let i=0; i<axis.length; i++) {
      axis[i] = i+1
    }

    return axis
  }

  //-------------------------------------------------------------------------

  private rebuildAnnotations() : ApexAnnotations {
    if (this._par == undefined) {
      return {}
    }

    let list = [...this.rebuildDevelopment(this._par), ...this.rebuildInSample(this._par), ...this.rebuildLive(this._par)]

    return {
      xaxis: list
    }
  }

  //-------------------------------------------------------------------------

  private rebuildDevelopment(par : PerformanceAnalysisResponse) : XAxisAnnotations[] {
    let isFrom = par.tradingSystem?.inSampleFrom
    if (isFrom == undefined || isFrom == 0) {
      return []
    }

    let y = new IntDateAdapter().year(isFrom)
    let m = new IntDateAdapter().month(isFrom)
    let d = new IntDateAdapter().day(isFrom)

    return [{
        x : new Date(1980, 1, 1).getTime(),
        x2: new Date(y, m-1, d).getTime(),
        fillColor: "#C0C0C0",
        opacity: 0.1,
        strokeDashArray: 0,
        borderColor: '#808080',
        label: {
          borderColor: '#808080',
          style: {
            fontSize  : '13px',
            color     : '#fff',
            background: '#808080',
          },
          text: this.loc("development"),
        }
      }]
  }

  //-------------------------------------------------------------------------

  private rebuildInSample(par : PerformanceAnalysisResponse) : XAxisAnnotations[] {
    let isTo = par.tradingSystem?.inSampleTo
    if (isTo == undefined || isTo == 0) {
      return []
    }

    let y = new IntDateAdapter().year(isTo)
    let m = new IntDateAdapter().month(isTo)
    let d = new IntDateAdapter().day(isTo)

    return [{
      x : new Date(y, m-1, d).getTime(),
      x2: new Date().getTime(),
      fillColor: "#B3F7CA",
      opacity: 0.2,
      strokeDashArray: 0,
      borderColor: '#775DD0',
      label: {
        borderColor: '#775DD0',
        style: {
          fontSize  : '13px',
          color     : '#fff',
          background: '#775DD0',
        },
        text: this.loc("outOfSample"),
      }
    }]
  }

  //-------------------------------------------------------------------------

  private rebuildLive(par : PerformanceAnalysisResponse) : XAxisAnnotations[] {
    let list :XAxisAnnotations[] = []

    par.livePeriods.forEach((d, i) => {
      let from = new Date(2000, 1, 1).getTime()
      let to   = new Date(3000, 2, 1).getTime()

      if (d.from) {
        from = new Date(d.from).getTime()
      }

      if (d.to) {
        to = new Date(d.to).getTime()
      }

      let lp = {
        x : from,
        x2: to,
        fillColor: "#F3B7CA",
        opacity: 0.2,
        strokeDashArray: 0,
        borderColor: '#D75D70',
        label: {
          borderColor: '#D75D70',
          style: {
            fontSize  : '13px',
            color     : '#fff',
            background: '#D75D70',
          },
          text: this.loc("live"),
        }
      }
      list = list.concat(lp)
    })

    return list
  }
}

//=============================================================================
