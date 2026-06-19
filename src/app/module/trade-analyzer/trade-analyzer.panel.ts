//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../component/abstract.panel";
import {EventBusService} from "../../service/eventbus.service";
import {LabelService} from "../../service/label.service";
import {PortfolioService} from "../../service/portfolio.service";
import {LocalService} from "../../service/local.service";
import {BroadcastEvent, BroadcastService, EventType} from "../../service/broadcast.service";
import {ModuleTitlePanel} from "../../component/panel/module-title/module-title.panel";
import {PeriodSelector, PeriodSelectorInfo} from "../../component/form/period-selector/period-selector";
import {TradeEquityPanel} from "./equity/equity.panel";
import {TradeRunupPanel} from "./runup/runup.panel";
import {TradeAnalysisRequest, TradeAnalysisResponse} from "../../model/trade-analysis";

//=============================================================================

@Component({
  selector: "tradingSystem-trades",
  templateUrl: './trade-analyzer.panel.html',
  styleUrls : ['./trade-analyzer.panel.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, MatButtonToggleModule, MatIconModule, ModuleTitlePanel, TradeEquityPanel, TradeRunupPanel, PeriodSelector,
  ]
})

//=============================================================================

export class TradeAnalyzerPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  period  : PeriodSelectorInfo = new PeriodSelectorInfo()
  periods : any

  selTab = new FormControl("equity")

  tsId : number = 0
  tar  : TradeAnalysisResponse = new TradeAnalysisResponse()

  goodData = true

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute,
              private portfolioService : PortfolioService,
              private localService     : LocalService,
              private broadcastService : BroadcastService) {

    super(eventBusService, labelService, router, "module.trade", "tradingSystem");

    this.period.daysBack = 365 *5
    broadcastService.onEvent((e : BroadcastEvent)=>{
      if (e.type == EventType.TradingsSystem_Deleted && e.id == this.tsId) {
        window.close()
      }
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    console.log("TradeAnalyzerPanel: Initializing...")

    this.periods = this.labelMap("periods");
    this.tsId    = Number(this.route.snapshot.paramMap.get("id"));
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPeriodChange(period : PeriodSelectorInfo) {
    console.log("Analysis period change : ", period)
    this.reload();
  }

  //-------------------------------------------------------------------------

  onReloadClick() {
    this.reload();
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    window.close()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private reload() {
    if (this.tsId == 0) {
      return
    }

    console.log("Reloading with: tsId="+ this.tsId +", daysBack="+ this.period.daysBack)

    let req : TradeAnalysisRequest = {
      daysBack : this.period.daysBack,
      fromDate : this.period.fromDate,
      toDate   : this.period.toDate,
    }

    if (this.period.custom) {
      req.daysBack = undefined
    }

    this.portfolioService.getTradeAnalysis(this.tsId, req).subscribe(res => {
      this.tar      = res
      this.goodData = res?.trades?.length > 0
    })
  }
}

//=============================================================================
