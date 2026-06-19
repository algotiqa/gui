//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
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
import {SelectRequired} from "../../component/form/select-required/select-required";
import {BroadcastEvent, BroadcastService, EventType} from "../../service/broadcast.service";
import {ModuleTitlePanel} from "../../component/panel/module-title/module-title.panel";
import {QualityMarketPanel} from "./market/market.panel";
import {QualityAnalysisRequest, QualityAnalysisResponse} from "../../model/quality";
import {PeriodSelector, PeriodSelectorInfo} from "../../component/form/period-selector/period-selector";

//=============================================================================

@Component({
  selector: "tradingSystem-quality",
  templateUrl: './quality.panel.html',
  styleUrls : ['./quality.panel.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, MatButtonToggleModule, MatIconModule, SelectRequired, ModuleTitlePanel, QualityMarketPanel, PeriodSelector,
  ]
})

//=============================================================================

export class TradingSystemQualityPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  period         : PeriodSelectorInfo = new PeriodSelectorInfo()
  timeframeType  : string = "daily"
  atrLength      : string = "20"

  periods   : any
  timeframes: any
  atrLengths: any

  selTab = new FormControl("market")

  tsId : number = 0
  qar  : QualityAnalysisResponse = new QualityAnalysisResponse()

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

    super(eventBusService, labelService, router, "module.quality", "tradingSystem");

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
    console.log("TradingSystemQualityPanel: Initializing...")

    this.periods   = this.labelMap("periods");
    this.timeframes= this.labelMap("timeframes");
    this.atrLengths= this.labelService.getLabel("map.atrLength");
    this.tsId      = Number(this.route.snapshot.paramMap.get("id"));

    //--- Reloading is implicitly triggered by the 2 select-required components
    //--- this.reload()
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

  onTimeframeChange(value: string) {
    console.log("Timeframe type change : ", value)
    this.reload();
  }

  //-------------------------------------------------------------------------

  onAtrLengthChange(value: number) {
    console.log("ATR length change : ", value)
    this.reload();
  }

  //-------------------------------------------------------------------------

  onTabSet() {
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

    console.log("Reloading with: tsId="+this.tsId+", daysBack="+ this.period.daysBack)

    let req : QualityAnalysisRequest = {
      daysBack     : this.period.daysBack,
      timeframeType: this.timeframeType,
      atrLength    : Number(this.atrLength),
      fromDate     : this.period.fromDate,
      toDate       : this.period.toDate,
    }

    if (this.period.custom) {
      req.daysBack = undefined
    }

    this.portfolioService.getQualityAnalysis(this.tsId, req).subscribe(res => {
      this.qar      = res
      this.goodData = res.qualityAllGross != undefined
    })
  }
}

//=============================================================================
