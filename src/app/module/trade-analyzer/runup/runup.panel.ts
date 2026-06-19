//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {LocalService} from "../../../service/local.service";
import {Metrics, QualityAnalysisResponse} from "../../../model/quality";
import {TradeAnalysisResponse, TradeEntry, TradeEquity} from "../../../model/trade-analysis";
import {ApexAxisChartSeries, ChartComponent} from "ng-apexcharts";
import {FlexTablePanel} from "../../../component/panel/flex-table/flex-table.panel";
import {createChart} from "../../../layout/main-panel/work-panel/portfolio/monitoring/chart-management";
import {FlexTableColumn} from "../../../model/flex-table";
import {ChartOptions} from "../../../lib/chart-lib";
import {SelectionModel} from "@angular/cdk/collections";
import {Lib} from "../../../lib/lib";
import {DataPointTimeTranscoder} from "../../../component/panel/flex-table/transcoders";
import {Trade} from "../../../model/model";

//=============================================================================

@Component({
  selector: 'trade-runup-panel',
  templateUrl: './runup.panel.html',
  styleUrls:  ['./runup.panel.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    ChartComponent,
  ]
})

//=============================================================================

export class TradeRunupPanel extends AbstractPanel {

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
    super(eventBusService, labelService, router, "module.trade.runup", "")

    this.chartOptions = this.buildChartOptions()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {}

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
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildChartOptions() : ChartOptions {
    return Lib.chart.buildLineOptions({
      title: {
        text: "",
      },
      chart: {
        type: 'rangeBar',
      },
      grid: {
        xaxis: {
          lines: {
            show: false
          }
        }
      },
      xaxis: {
        tickAmount: 40,
      },
      legend: {
        show: false
      }
    })
  }

  //-------------------------------------------------------------------------

  private rebuild() {
    let tradeType   = this.tradeType.value
    let returnType  = this.returnType.value
    let successType = this.successType.value

    let serie  : any = {
      name: "",
      data: [],
    }

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
          let de = (returnType == "gross")
                      ? this.buildEntry(te, te.grossEquity)
                      : this.buildEntry(te, te.netEquity)

          serie.data.push(de)
        }
      })
    }

    this.chartOptions.series = [ serie ]
  }

  //-------------------------------------------------------------------------

  private buildEntry(te : TradeEntry, eq : TradeEquity|undefined) : any {
    let name = String(te.entryDate).substring(0, 10);
    let color= this.assignColor(te)

    return {
      x : name,
      y : [ eq?.return, eq?.runUp],
      fillColor  : color,
      strokeColor: color,
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
}

//=============================================================================
