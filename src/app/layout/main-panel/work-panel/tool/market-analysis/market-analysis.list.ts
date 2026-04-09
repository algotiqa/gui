//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {DataProductSelector} from "../../../../../component/form/data-product-selector/product-selector.panel";
import {SelectRequired} from "../../../../../component/form/select-required/select-required";
import {AbstractPanel} from "../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../service/eventbus.service";
import {LabelService} from "../../../../../service/label.service";
import {CollectorService} from "../../../../../service/collector.service";
import {MarketAnalysisBarsPanel} from "./daily/market-analysis.bars";
import {BarResult} from "./model";
import {TimeframeSelector} from "../../../../../component/form/timeframe-selector/timeframe-selector";
import {PeriodSelector, PeriodSelectorInfo} from "../../../../../component/form/period-selector/period-selector";

//=============================================================================

@Component({
  selector: "market-analysis-list",
  templateUrl: './market-analysis.list.html',
  styleUrls: [ './market-analysis.list.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, SelectRequired, DataProductSelector, MarketAnalysisBarsPanel, TimeframeSelector, PeriodSelector
  ]
})

//=============================================================================

export class MarketAnalysisListPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  id?        : number
  period     : PeriodSelectorInfo = new PeriodSelectorInfo()
  atrLength  : string             = "20"
  timeframe  : number             = 1440

  atrLengths : any
  timeframes : any

  barResults : BarResult[] = []

  @ViewChild("tsDataCtrl") tsDataCtrl? : DataProductSelector

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private collectorService : CollectorService) {

    super(eventBusService, labelService, router, "tool.marketAnalysis");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    console.log("MarketAnalysisListPanel: Initializing...")

    this.atrLengths = this.labelService.getLabel("map.atrLength");
    this.timeframes = this.labelService.getLabel("map.timeframe");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onProductChange(value:number|undefined) {
    console.log("Product change : ", value)
    this.id = value
    this.reload();
  }

  //-------------------------------------------------------------------------

  onPeriodChange(period: PeriodSelectorInfo) {
    console.log("Analysis period change : ", period)
    this.reload();
  }

  //-------------------------------------------------------------------------

  onAtrLengthChange(value: number) {
    console.log("ATR length change : ", value)
    this.reload();
  }

  //-------------------------------------------------------------------------

  onTimeframeChange(value: number) {
    console.log("Timeframe change : ", value)
    this.reload();
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private reload() : void {
    if (this.id) {
      let daysBack : number|undefined = this.period.daysBack
      let fromDate    = this.period.fromDate;
      let toDate      = this.period.toDate;

      if (this.period.custom) {
        daysBack = undefined
      }
      this.collectorService.analyzeProduct(this.id, daysBack, fromDate, toDate, this.timeframe, 10000).subscribe( res => {
        this.barResults = res.barResults
      })
    }
  }
}

//=============================================================================
