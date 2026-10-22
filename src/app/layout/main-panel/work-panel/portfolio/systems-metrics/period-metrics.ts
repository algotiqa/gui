//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component} from '@angular/core';

import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {Router, RouterModule} from "@angular/router";
import {ListButtons, ListContent, ListPanel} from "../../../../../component/panel/list-panel/list-panel";
import {NavigationService} from "../../../../../service/navigation.service";
import {PortfolioService} from "../../../../../service/portfolio.service";
import {SelectTextRequired} from "../../../../../component/form/select-optional/select-optional";
import {PortfolioFull} from "../../../../../model/model";
import {InventoryService} from "../../../../../service/inventory.service";
import {Metrics, MetricsResponse, TradingSystemMetrics} from "../../../../../model/metric";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";

//=============================================================================

const M3 = "m3"
const M4 = "m4"
const M6 = "m6"
const M9 = "m9"
const Y1 = "y1"
const Y5 = "y5"

//-----------------------------------------------------------------------------

const NetReturn     = "netReturn"
const Trades        = "trades"
const AverageTrade  = "averageTrade"
const ProfitFactor  = "profitFactor"
const WinningPerc   = "winningPerc"
const MaxDrawdown   = "maxDrawdown"
const SharpeRatio   = "sharpeRatio"
const Sqn100        = "sqn100"
const ReturnDDRatio = "returnDDRatio"

//-----------------------------------------------------------------------------

const All     = "all"
const Running = "running"
const Stopped = "stopped"

//=============================================================================

@Component({
    selector: 'period-metrics',
    templateUrl: './period-metrics.html',
    styleUrls:  ['./period-metrics.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListButtons, ListContent, ListPanel, SelectTextRequired, MatButtonToggle, MatButtonToggleGroup, ReactiveFormsModule, MatTable, MatColumnDef, MatHeaderCell, MatCell, MatHeaderCellDef, MatCellDef, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef, FormsModule]
})

//=============================================================================

export class PeriodMetricsPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  portfolioId: number = 0
  portfolios : PortfolioFull[] = []
  filter     : string = ""

  selPeriod = new FormControl([ M3, M4, M6, M9, Y1,Y5 ])
  selMetrics= new FormControl([ NetReturn, Trades, AverageTrade, ProfitFactor, WinningPerc, MaxDrawdown, SharpeRatio, Sqn100, ReturnDDRatio ])
  selSystems= new FormControl( All )

  columnNames : string             [] = [];
  columnInfos : TradingSystemColumn[] = [];
  systems     : TradingSystemItem  [] = []

  res?    : MetricsResponse;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private navigationService: NavigationService,
              private inventoryService : InventoryService,
              private portfolioService : PortfolioService) {

    super(eventBusService, labelService, router, "portfolio.metrics");

    this.navigationService.set()

    inventoryService.getPortfolios(true).subscribe(
      result => {
        this.portfolios = result.result
        this.portfolios.forEach( p => {
          p.name = p.accountCode +" --> "+ p.name
        })

        //--- Add "all" option

        let all = {
          id        : 0,
          name      : this.loc("all"),
          management: "M"
        }

        this.portfolios = [ all, ...this.portfolios ]
      })
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.reload()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPortfolioChange(porId : number) : void {
    this.reload()
  }

  //-------------------------------------------------------------------------

  onChange() {
    this.rebuild()
  }

  //-------------------------------------------------------------------------
  //---
  //--- General methods
  //---
  //-------------------------------------------------------------------------

  public per(code : string) : string {
    return this.loc("periods."+ code)
  }

  //-------------------------------------------------------------------------

  public met(code : string) : string {
    return this.loc("metrics."+ code)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private reload() {
    this.portfolioService.getMetrics(this.portfolioId).subscribe( res => {
      this.res = res
      this.rebuild()
    })
  }

  //-------------------------------------------------------------------------

  private rebuild() {
    if (this.res) {
      this.rebuildI(this.res.tradingSystems)
    }
  }

  //-------------------------------------------------------------------------

  private rebuildI(list : TradingSystemMetrics[]) {
    let colNames  : string[]              = []
    let colInfos  : TradingSystemColumn[] = []
    let runSystems: TradingSystemItem[]   = []
    let stpSystems: TradingSystemItem[]   = []

    //--- Step 1: Build rows

    list.forEach((tsm) => {
      if (this.showing(tsm) && this.nameMatches(tsm)) {
        let tsi = new TradingSystemItem()
        tsi.name = tsm.name
        tsi.color= tsm.running ? "#FFFFFF" : "#E8E8E8"

        if (tsm.running) {
          runSystems.push(tsi)
        }
        else {
          stpSystems.push(tsi)
        }

        this.selPeriod.value?.forEach( (periodName) => {
          this.selMetrics.value?.forEach( (metricName) => {
            let columnId = periodName+"_"+metricName
            let period   = this.findPeriod(tsm, periodName)
            let value    = this.findMetric(period, metricName)

            let cell = new TradingSystemCell()
            cell.value     = value
            cell.backColor = this.calcBackColor(metricName, value)
            tsi.metrics[columnId] = cell
          })
        })
      }
    })

    //--- Step 2: Build headers

    colNames.push("name")
    this.selPeriod.value?.forEach( (periodName) => {
      this.selMetrics.value?.forEach( (metricName) => {
        let columnId = periodName+"_"+metricName

        let col = new TradingSystemColumn(columnId, this.met(metricName) +"\n"+ this.per(periodName))
        colInfos.push(col)
        colNames.push(columnId)
      })
    })

    runSystems.sort( (a,b) => a.name.localeCompare(b.name))
    stpSystems.sort( (a,b) => a.name.localeCompare(b.name))

    this.columnNames = colNames
    this.columnInfos = colInfos
    this.systems     = [ ...runSystems , ...stpSystems ]
  }

  //-------------------------------------------------------------------------

  private showing(tsm : TradingSystemMetrics) : boolean {
    let value = this.selSystems.value
    return value == All || (value == Running && tsm.running) || (value == Stopped && !tsm.running);
  }

  //-------------------------------------------------------------------------

  private nameMatches(tsm : TradingSystemMetrics) : boolean {
    let filter = this.filter.toLowerCase()
    let name   = tsm.name.toLowerCase()

    return (filter == "") || (name.includes(filter))
  }

  //-------------------------------------------------------------------------

  private findPeriod(tsm : TradingSystemMetrics, name : string) : Metrics {
    if (name == M3) return tsm.metrics3m
    if (name == M4) return tsm.metrics4m
    if (name == M6) return tsm.metrics6m
    if (name == M9) return tsm.metrics9m
    if (name == Y1) return tsm.metrics1y

    return tsm.metrics5y
  }

  //-------------------------------------------------------------------------

  private findMetric(metrics : Metrics, name : string) : number {
    if (name == NetReturn   ) return metrics.netReturn
    if (name == Trades      ) return metrics.trades
    if (name == AverageTrade) return metrics.averageTrade
    if (name == ProfitFactor) return metrics.profitFactor
    if (name == WinningPerc ) return metrics.winningPerc
    if (name == MaxDrawdown ) return metrics.maxDrawdown
    if (name == SharpeRatio ) return metrics.sharpeRatio
    if (name == Sqn100      ) return metrics.sqn100

    return metrics.returnDDRatio
  }

  //-------------------------------------------------------------------------

  private calcBackColor(metric : string, value : number) : string {
    if (metric == NetReturn) {
      if (value < 0 ) return "#FFF0F0"
      if (value > 0 ) return "#F0FFF0"
    }

    if (metric == AverageTrade) {
      if (value < 0 ) return "#FFF0F0"
      if (value > 0 ) return "#F0FFF0"
    }

    if (metric == ProfitFactor) {
      if (value <= 1 ) return "#FFF0F0"
      if (value  > 1 ) return "#F0FFF0"
    }

    if (metric == WinningPerc) {
      if (value <= 50 ) return "#FFF0F0"
      if (value  > 50 ) return "#F0FFF0"
    }

    if (metric == SharpeRatio) {
      if (value  < 0.0 ) return "#FFF0F0"
      if (value <= 1.0 ) return "#FFFFF0"
      if (value  > 1.0 ) return "#F0FFF0"
    }

    if (metric == Sqn100) {
      if (value  < 0   ) return "#FFF0F0"
      if (value  < 1.6 ) return "#FFFFF0"
      if (value >= 1.6 ) return "#F0FFF0"
    }

    if (metric == ReturnDDRatio) {
      if (value <= 1.1 ) return "#FFF0F0"
      if (value  > 1.1 ) return "#F0FFF0"
    }

    return "#FFFFFF"
  }
}

//=============================================================================

class TradingSystemColumn {
  name : string = ""
  label: string = ""

  constructor(name : string, label : string) {
    this.name  = name
    this.label = label
  }

  cell(row : TradingSystemItem) : TradingSystemCell {
    return row.metrics[this.name]
  }
}

//=============================================================================

class TradingSystemItem {
  name    : string = ""
  color   : string = ""
  metrics : {[key:string] : TradingSystemCell} = {}
}

//=============================================================================

class TradingSystemCell {
  value    : any
  backColor: string = "#FFFFFF"
}

//=============================================================================
