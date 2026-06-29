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
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ListButtons, ListContent, ListLeft, ListPanel} from "../../../../../../component/panel/list-panel/list-panel";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {NavigationService} from "../../../../../../service/navigation.service";
import {BackButton} from "../../../../../../component/button/back/back.button";
import {OptimizeButton} from "../../../../../../component/button/optimize/optimize.button";
import {PeriodSelector, PeriodSelectorInfo} from "../../../../../../component/form/period-selector/period-selector";
import {ReloadButton} from "../../../../../../component/button/reload/reload.button";
import {RunButton} from "../../../../../../component/button/run/run.button";
import {SaveButton} from "../../../../../../component/button/save/save.button";
import {InputNumber} from "../../../../../../component/form/input-number/input-number";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {
  AnalysisResult, Model,
  PositionAnalysisRequest, PositionAnalysisResponse, PositionParameters, TradingPosition
} from "../../../../../../model/position-sizing";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {ParamSpec} from "../../../../../../model/model";

//=============================================================================

@Component({
  selector: 'position-sizing',
  templateUrl: './position-sizing.panel.html',
  styleUrls: [ './position-sizing.panel.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, RouterModule, ListPanel, ListButtons,
            ListContent, BackButton, OptimizeButton, PeriodSelector, ReloadButton, RunButton, SaveButton, ListLeft,
            InputNumber, SelectRequired]
})

//=============================================================================

export class PositionSizingPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  tsId     : number = 0
  period   : PeriodSelectorInfo = new PeriodSelectorInfo()
  params   : PositionParameters = new PositionParameters()
  curModel : Model = new Model()
  selModel : Model = new Model()
  specs    : {[name:string]:ParamSpec} = {}

  positionModels         : Object = {}
  positionRiskPerUnits   : Object = {}
  positionMoneyConversion: Object = {}

  par : PositionAnalysisResponse = new PositionAnalysisResponse()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService              : EventBusService,
              labelService                 : LabelService,
              router                       : Router,
              private route                : ActivatedRoute,
              private portfolioService     : PortfolioService,
              private navigationService    : NavigationService,
              public  dialog               : MatDialog
  ) {

    super(eventBusService, labelService, router, "portfolio.positionSizing");
    this.navigationService.push()
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.tsId = Number(this.route.snapshot.paramMap.get("id"));
    this.positionModels         = this.labelService.getLabel("map.positionModel")
    this.positionRiskPerUnits   = this.labelService.getLabel("map.positionRiskPerUnit")
    this.positionMoneyConversion= this.labelService.getLabel("map.positionMoneyConversion")

    this.callService(this.buildDefaultRequest())
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public
  //---
  //-------------------------------------------------------------------------

  curName() : any {
    // @ts-ignore
    return this.positionModels[this.curModel.name]
  }

  //-------------------------------------------------------------------------

  curMoneyConversion() : any {
    // @ts-ignore
    return this.positionMoneyConversion[this.curModel.config['moneyConversion']]
  }

  //-------------------------------------------------------------------------

  min(name:string) : number {
    return this.specs[name].minValue
  }

  //-------------------------------------------------------------------------

  max(name:string) : number {
    return this.specs[name].maxValue
  }

  //-------------------------------------------------------------------------

  opt(name:string) : boolean {
    return !this.specs[name].required
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPeriodChange(period : PeriodSelectorInfo) {
    console.log("On period change")
  }

  //-------------------------------------------------------------------------

  onRunClick() {
    let req = <PositionAnalysisRequest>{
      params : this.params,
      model  : this.selModel,
      period : this.period.getSelectedPeriod()
    }

    this.callService(req)
  }

  //-------------------------------------------------------------------------

  onOptimizeClick() {
    // this.portfolioService.getFilterOptimizationInfo(this.tsId).subscribe(
    //   result => {
    //     if (result.status == "idle") {
    //       this.openParametersDialog()
    //     }
    //     else if (result.status == "running"){
    //       this.openProgressDialog()
    //     }
    //     else {
    //       this.openResultDialog()
    //     }
    //   }
    // )
  }

  //-------------------------------------------------------------------------

  onSaveClick() {
    // this.portfolioService.setTradingFilters(this.tsId, this.filter).subscribe(
    //   result => {
    //     this.snackBar.open(this.loc("filterSaved"), undefined, { duration: 3000 })
    //   }
    // )
  }

  //-------------------------------------------------------------------------

  onReloadClick() {
    this.callService(this.buildDefaultRequest())
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildDefaultRequest() : PositionAnalysisRequest {
    let req = new PositionAnalysisRequest();
    req.period = this.period.getSelectedPeriod()

    return req
  }

  //-------------------------------------------------------------------------

  private callService(req : PositionAnalysisRequest) {
    console.log("Calling service")
    this.portfolioService.runPositionAnalysis(this.tsId, req).subscribe(
      res => {
        this.par      = res
        this.params   = res.params
        this.curModel = res.current.model

        if (res.paramSpecs) {
          this.specs = res.paramSpecs
        }
      }
    )
  }
}

//=============================================================================
