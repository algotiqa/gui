//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, Input, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {LocalService} from "../../../service/local.service";
import {TradeAnalysisResponse, TradeEntry, TradeEquity} from "../../../model/trade-analysis";
import {Trade} from "../../../model/model";
import {NgApexchartsModule} from "ng-apexcharts";
import {ChartOptions} from "../../../lib/chart-lib";
import {Lib} from "../../../lib/lib";
import {FlexTablePanel} from "../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../model/flex-table";
import {DataPointTimeTranscoder} from "../../../component/panel/flex-table/transcoders";
import {SelectionModel} from "@angular/cdk/collections";

//=============================================================================

@Component({
  selector: 'trade-equity-panel',
  templateUrl: './equity.panel.html',
  styleUrls:  ['./equity.panel.scss'],
  imports: [
    ReactiveFormsModule, FormsModule, MatButtonToggle, MatButtonToggleGroup, NgApexchartsModule, FlexTablePanel,
  ]
})

//=============================================================================

export class TradeEquityPanel extends AbstractPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  @Input()
  set tar(tar : TradeAnalysisResponse) {
    this._tar = tar
    this.rebuild()
  }

  get tar() : TradeAnalysisResponse|undefined {
    return this._tar
  }

  _tar? : TradeAnalysisResponse

  //---------------------------------------------------------------------------

  tradeType   = new FormControl("all")
  returnType  = new FormControl("net")
  successType = new FormControl("all")

  columns     : FlexTableColumn[] = []
  tradeList   : TradeEntry[] = []
  barsOptions : ChartOptions;
  contOptions : ChartOptions;

  @ViewChild("table") table : FlexTablePanel<TradeEntry> | undefined

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService      : EventBusService,
              labelService         : LabelService,
              router               : Router,
              private localService : LocalService) {
    super(eventBusService, labelService, router, "module.trade.equity", "")

    this.barsOptions = this.buildBarsOptions()
    this.contOptions = this.buildContractsOptions()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onTradeTypeChange() {
    this.rebuild()
  }

  //-------------------------------------------------------------------------

  onReturnTypeChange() {
    this.rebuild()
  }

  //-------------------------------------------------------------------------

  onSuccessTypeChange() {
    this.rebuild()
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : TradeEntry[]) {
    this.rebuildCharts(selection)
  }

  //-------------------------------------------------------------------------

  onTableUpdate(data : TradeEntry[], selection : SelectionModel<TradeEntry>) : void {
    if (data) {
      data.forEach((row) => {
        selection.toggle(row)
      })
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildBarsOptions() : ChartOptions {
    return Lib.chart.buildLineOptions({
      title: {
        text: "",
      },
      chart: {
        type: 'line',
        animations: {
          enabled: false,
        }
      },
      xaxis: {
        tickAmount: 40,
      },
      grid: {
        xaxis: {
          lines: {
            show: false
          }
        }
      },
      stroke: {
        curve: "straight",
        width: 1,
      },
      legend: {
        show: false
      }
    })
  }

  //-------------------------------------------------------------------------

  private buildContractsOptions() : ChartOptions {
    return Lib.chart.buildLineOptions({
      title: {
        text: "",
      },
    })
  }

  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.trade");

    this.columns = [
      new FlexTableColumn(ts, "entryDate", new DataPointTimeTranscoder()),
      new FlexTableColumn(ts, "tradeType"),
      new FlexTableColumn(ts, "grossReturn"),
    ]
  }

  //-------------------------------------------------------------------------

  private rebuild() {
    this.rebuildTradeList()
  }

  //-------------------------------------------------------------------------

  private rebuildTradeList() {
    let tradeType   = this.tradeType.value
    let successType = this.successType.value

    this.tradeList = []

    if (this._tar?.trades) {
      this._tar?.trades.forEach(te => {
        let tradeCond = (tradeType == "all") ||
          (tradeType == "long"  && te.tradeType == "LO") ||
          (tradeType == "short" && te.tradeType == "SH")

        let successCond = (successType == "all") ||
          (successType == "winners" && te.grossReturn > 0) ||
          (successType == "loosers" && te.grossReturn < 0) ||
          (successType == "breaks"  && te.grossReturn == 0)

        if (tradeCond && successCond) {
          this.tradeList.push(te)
        }
      })
    }
  }

  //-------------------------------------------------------------------------

  private rebuildCharts(selection : TradeEntry[]) {
    let returnType = this.returnType.value
    let maxLength  = 0

    let tradeSeries : any[] = []

    selection.forEach(te => {
      let ds = (returnType == "gross")
                  ? this.buildSerie(te, te.grossEquity)
                  : this.buildSerie(te, te.netEquity)

      tradeSeries.push(ds)
      maxLength = Math.max(maxLength, ds.length)
    })

    this.barsOptions.labels = this.buildLabels(maxLength)
    this.barsOptions.series = tradeSeries
  }

  //-------------------------------------------------------------------------

  private buildSerie(te : TradeEntry, eq? : TradeEquity) : any {
    let name = String(te.entryDate).substring(0, 10);
    let color= this.assignColor(te)
    let data = eq?.equity
    if (data) {
      data = [ 0, ...data ]
    }

    return {
      name  : name,
      data  : data,
      color : color
      }
  }

  //-------------------------------------------------------------------------

  private assignColor(tr : Trade) : string {
    let ret = tr.grossReturn

    if (ret > 0) {
      if (tr.tradeType == "LO") {
        return "#008FFB"
      } else {
        return "#00C060"
      }
    }
    else if (ret < 0) {
      if (tr.tradeType == "LO") {
        return "#FF565A"
      } else {
        return "#A050A0"
      }
    }
    else {
      if (tr.tradeType == "LO") {
        return "#808080"
      } else {
        return "#505050"
      }
    }
  }

  //-------------------------------------------------------------------------

  private buildLabels(len : number) : any[] {
    let labels : any[] = []

    for (let i=0; i <= len ; i++) {
      labels.push(i)
    }
    return labels
  }
}

//=============================================================================
